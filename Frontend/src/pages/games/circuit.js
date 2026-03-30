import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CSS/Circuit.css';

// Touch-friendly Component for mobile circuit building
const TouchComponent = ({ component, onRemove, onSelect, isSelected, wireMode, componentData }) => {
  const handleComponentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wireMode) {
      onSelect(component.id);
    }
  };
  
  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(component.id);
  };
  
  return (
    <div
      className={`placed-component ${
        wireMode ? 'wire-mode' : ''
      } ${
        isSelected ? 'selected-for-wire' : ''
      }`}
      style={{
        position: 'absolute',
        left: component.x,
        top: component.y,
        backgroundColor: componentData.color,
        cursor: wireMode ? 'pointer' : 'default'
      }}
      onClick={handleComponentClick}
      onTouchEnd={handleComponentClick}
    >
      <div className="component-content">
        <span className="component-symbol">{componentData.symbol}</span>
        <span className="component-label">{componentData.name}</span>
        
        {/* Selection indicator */}
        {wireMode && (
          <div className="selection-indicator">
            {isSelected ? '✓' : '🔌'}
          </div>
        )}
        
        {/* Wire mode overlay */}
        {wireMode && (
          <div className="wire-overlay">
            <div className="wire-status">
              {isSelected ? 'Selected' : 'Tap to select'}
            </div>
          </div>
        )}
        
        {/* Large remove button */}
        <button
          className="remove-btn"
          onClick={handleRemoveClick}
          onTouchEnd={handleRemoveClick}
          title="Remove component"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [userCircuit, setUserCircuit] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [connections, setConnections] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [wireMode, setWireMode] = useState(false);
  const [selectedComponentType, setSelectedComponentType] = useState(null);
  const [placementMode, setPlacementMode] = useState(false);
  const circuitBoardRef = useRef(null);

  // Circuit component types
  const components = {
    battery: { symbol: '🔋', name: 'Battery', voltage: 3, color: '#4CAF50' },
    resistor: { symbol: '⚡', name: 'Resistor', resistance: 10, color: '#FF9800' },
    bulb: { symbol: '💡', name: 'Bulb', resistance: 5, color: '#FFEB3B' },
    wire: { symbol: '➖', name: 'Wire', resistance: 0, color: '#607D8B' },
    switch: { symbol: '⏺️', name: 'Switch', resistance: 0, color: '#9E9E9E' }
  };

  // Generate questions based on level
  const generateQuestion = (level) => {
    const questions = {
      1: {
        task: "Light one bulb with a battery",
        description: "Create a simple circuit to light up the bulb using a battery and connecting wires",
        requiredComponents: ['battery', 'bulb', 'wire'],
        minComponents: 3,
        targetCurrent: 0.6,
        circuitType: 'simple',
        hint: "Connect: Battery → Wire → Bulb → Wire → Battery"
      },
      2: {
        task: "Add a switch to control the bulb",
        description: "Build a circuit with a switch to turn the bulb on and off",
        requiredComponents: ['battery', 'bulb', 'switch', 'wire'],
        minComponents: 4,
        targetCurrent: 0.6,
        circuitType: 'switch',
        hint: "Place the switch anywhere in the circuit path"
      },
      3: {
        task: "Create a series circuit with 2 bulbs",
        description: "Connect two bulbs in series - they will share the voltage",
        requiredComponents: ['battery', 'bulb', 'bulb', 'wire'],
        minComponents: 4,
        targetCurrent: 0.3,
        circuitType: 'series',
        hint: "Current flows through bulb1 → bulb2 → back to battery"
      },
      4: {
        task: "Add a resistor to dim the bulb",
        description: "Use a resistor in series to reduce the brightness of the bulb",
        requiredComponents: ['battery', 'bulb', 'resistor', 'wire'],
        minComponents: 4,
        targetCurrent: 0.2,
        circuitType: 'resistor_series',
        hint: "Resistor adds resistance, reducing current flow"
      },
      5: {
        task: "Create a parallel circuit with 2 bulbs",
        description: "Connect two bulbs in parallel - both should be bright",
        requiredComponents: ['battery', 'bulb', 'bulb', 'wire'],
        minComponents: 5,
        targetCurrent: 1.2,
        circuitType: 'parallel',
        hint: "Each bulb gets full voltage in parallel"
      },
      6: {
        task: "Mixed series-parallel circuit",
        description: "Create a circuit combining series and parallel connections",
        requiredComponents: ['battery', 'bulb', 'bulb', 'resistor', 'wire'],
        minComponents: 6,
        targetCurrent: 0.9,
        circuitType: 'series_parallel',
        hint: "Try parallel bulbs in series with a resistor"
      },
      7: {
        task: "Two batteries in series",
        description: "Use two batteries in series for higher voltage",
        requiredComponents: ['battery', 'battery', 'bulb', 'wire'],
        minComponents: 4,
        targetCurrent: 1.2,
        circuitType: 'multi_battery',
        hint: "Batteries in series add their voltages"
      },
      8: {
        task: "Complex parallel network",
        description: "Create a parallel circuit with 3 different branches",
        requiredComponents: ['battery', 'bulb', 'bulb', 'resistor', 'wire'],
        minComponents: 7,
        targetCurrent: 1.5,
        circuitType: 'complex_parallel',
        hint: "Each branch operates independently"
      },
      9: {
        task: "Switched parallel circuit",
        description: "Build a parallel circuit where each branch can be controlled",
        requiredComponents: ['battery', 'bulb', 'bulb', 'switch', 'switch', 'wire'],
        minComponents: 8,
        targetCurrent: 1.2,
        circuitType: 'switched_parallel',
        hint: "Each branch needs its own switch"
      },
      10: {
        task: "Master electronics challenge",
        description: "Design a complex circuit with multiple components and controls",
        requiredComponents: ['battery', 'battery', 'bulb', 'bulb', 'resistor', 'switch', 'wire'],
        minComponents: 10,
        targetCurrent: 0.8,
        circuitType: 'master_challenge',
        hint: "Combine all your circuit knowledge!"
      }
    };

    return questions[level] || questions[1];
  };

  const startNewQuestion = () => {
    const question = generateQuestion(level);
    setCurrentQuestion(question);
    setUserCircuit([]);
    setConnections([]);
    setFeedback('');
    setShowResult(false);
    setSelectedComponent(null);
    setSelectedComponents([]);
    setWireMode(false);
    setPlacementMode(false);
    setSelectedComponentType(null);
  };

  const selectComponentForPlacement = (componentType) => {
    setSelectedComponentType(componentType);
    setPlacementMode(true);
    setWireMode(false);
    setSelectedComponents([]);
  };

  const handleBoardClick = (e) => {
    if (!placementMode || !selectedComponentType) return;
    
    const boardRect = circuitBoardRef.current.getBoundingClientRect();
    const x = e.clientX - boardRect.left - 40; // Center the component
    const y = e.clientY - boardRect.top - 40;
    
    // Keep within bounds
    const maxX = boardRect.width - 80;
    const maxY = boardRect.height - 80;
    const boundedX = Math.max(10, Math.min(x, maxX));
    const boundedY = Math.max(10, Math.min(y, maxY));

    const newComponent = {
      id: Date.now() + Math.random(),
      type: selectedComponentType,
      x: boundedX,
      y: boundedY,
      connections: []
    };
    
    setUserCircuit(prev => [...prev, newComponent]);
    setPlacementMode(false);
    setSelectedComponentType(null);
  };

  // Component movement removed for mobile - components stay where placed
  
  const clearWireSelections = () => {
    setSelectedComponents([]);
  };
  
  const deleteLastConnection = () => {
    if (connections.length > 0) {
      setConnections(prev => prev.slice(0, -1));
    }
  };

  const handleComponentSelection = (componentId) => {
    if (!wireMode) return;
    
    setSelectedComponents(prev => {
      const newSelected = [...prev];
      const index = newSelected.indexOf(componentId);
      
      if (index > -1) {
        // Component already selected, remove it
        newSelected.splice(index, 1);
      } else {
        // Add component to selection
        newSelected.push(componentId);
        
        // If we have 2 components selected, auto-connect them
        if (newSelected.length === 2) {
          const [comp1, comp2] = newSelected;
          
          // Check if connection already exists
          const connectionExists = connections.some(conn => 
            (conn.from === comp1 && conn.to === comp2) ||
            (conn.from === comp2 && conn.to === comp1)
          );
          
          if (!connectionExists) {
            const newConnection = {
              id: Date.now(),
              from: comp1,
              to: comp2
            };
            setConnections(prev => [...prev, newConnection]);
          }
          
          // Clear selection after connecting
          return [];
        }
      }
      
      return newSelected;
    });
  };

  const removeConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  const validateCircuit = () => {
    if (!currentQuestion || userCircuit.length < currentQuestion.minComponents) {
      return { isValid: false, reason: `Need at least ${currentQuestion.minComponents} components` };
    }

    // Check if all required components are present
    const componentCounts = {};
    userCircuit.forEach(comp => {
      componentCounts[comp.type] = (componentCounts[comp.type] || 0) + 1;
    });

    for (const required of currentQuestion.requiredComponents) {
      const requiredCount = currentQuestion.requiredComponents.filter(c => c === required).length;
      if ((componentCounts[required] || 0) < requiredCount) {
        return { isValid: false, reason: `Missing ${components[required].name}` };
      }
    }

    // Simulate circuit based on type
    return simulateCircuit(currentQuestion.circuitType, userCircuit);
  };

  const simulateCircuit = (circuitType, circuit) => {
    const batteries = circuit.filter(c => c.type === 'battery').length;
    const bulbs = circuit.filter(c => c.type === 'bulb').length;
    const resistors = circuit.filter(c => c.type === 'resistor').length;
    const switches = circuit.filter(c => c.type === 'switch').length;
    const wires = circuit.filter(c => c.type === 'wire').length;
    
    if (batteries === 0) return { isValid: false, reason: "No power source (battery)" };
    if (connections.length === 0 && circuit.length > 1) {
      return { isValid: false, reason: "Components need to be connected" };
    }

    // Check if circuit is physically feasible
    const isFeasible = validateCircuitFeasibility(circuit, connections);
    if (!isFeasible) {
      return { isValid: false, reason: "Circuit configuration is not feasible" };
    }

    // Basic circuit validation
    let isValid = true;
    let reason = "Perfect circuit!";

    switch (circuitType) {
      case 'simple':
        isValid = batteries >= 1 && bulbs >= 1;
        break;
      case 'switch':
        isValid = batteries >= 1 && bulbs >= 1 && switches >= 1;
        break;
      case 'series':
        isValid = batteries >= 1 && bulbs >= 2;
        break;
      case 'parallel':
        isValid = batteries >= 1 && bulbs >= 2 && connections.length >= 3;
        break;
      case 'multi_battery':
        isValid = batteries >= 2 && bulbs >= 1;
        break;
      default:
        isValid = batteries >= 1 && (bulbs >= 1 || resistors >= 1);
    }

    if (!isValid) reason = "Check component requirements";

    return { 
      isValid, 
      reason, 
      current: isValid ? currentQuestion.targetCurrent : 0,
      voltage: batteries * 3,
      power: isValid ? (currentQuestion.targetCurrent * batteries * 3).toFixed(2) : 0
    };
  };

  const checkCircuitPath = (circuit, connections) => {
    if (circuit.length <= 1) return true;
    
    const batteries = circuit.filter(c => c.type === 'battery');
    if (batteries.length === 0) return false;
    
    // Advanced circuit feasibility check
    return validateCircuitFeasibility(circuit, connections);
  };

  const validateCircuitFeasibility = (circuit, connections) => {
    if (circuit.length === 0) return false;
    
    const batteries = circuit.filter(c => c.type === 'battery');
    const bulbs = circuit.filter(c => c.type === 'bulb');
    const resistors = circuit.filter(c => c.type === 'resistor');
    const switches = circuit.filter(c => c.type === 'switch');
    
    // Must have at least one battery
    if (batteries.length === 0) return false;
    
    // Must have load components (bulbs or resistors)
    if (bulbs.length === 0 && resistors.length === 0) return false;
    
    // Check if all components are connected in a valid circuit
    if (circuit.length > 1 && connections.length === 0) return false;
    
    // For series circuits - need at least n-1 connections for n components
    if (connections.length < circuit.length - 1) return false;
    
    // Check for impossible circuit configurations
    const componentIds = new Set(circuit.map(c => c.id));
    const connectedIds = new Set();
    
    connections.forEach(conn => {
      connectedIds.add(conn.from);
      connectedIds.add(conn.to);
    });
    
    // All components should be part of connections (except for single component circuits)
    if (circuit.length > 1) {
      const unconnectedComponents = circuit.filter(c => !connectedIds.has(c.id));
      if (unconnectedComponents.length > 0) return false;
    }
    
    return true;
  };

  const submitAnswer = () => {
    const validation = validateCircuit();
    setTotalQuestions(prev => prev + 1);
    setShowResult(true);
    
    if (validation.isValid) {
      setScore(prev => prev + level * 20);
      setQuestionsCorrect(prev => prev + 1);
      setFeedback(`🎉 Excellent! ${validation.reason}\n💡 Current: ${validation.current}A, Power: ${validation.power}W`);
      
      // Level up every 2 correct answers (except level 10)
      if ((questionsCorrect + 1) % 2 === 0 && level < 10) {
        setLevel(prev => prev + 1);
        setFeedback(`🎉 Circuit works perfectly! Level up to ${level + 1}!\n🔬 Current: ${validation.current}A, Power: ${validation.power}W`);
      }
    } else {
      setFeedback(`❌ ${validation.reason}\n💭 Hint: ${currentQuestion.hint}`);
    }
  };

  const removeComponent = (componentId) => {
    setUserCircuit(prev => prev.filter(comp => comp.id !== componentId));
    // Remove associated connections
    setConnections(prev => 
      prev.filter(conn => conn.from !== componentId && conn.to !== componentId)
    );
  };

  useEffect(() => {
    startNewQuestion();
  }, [level]);

  if (!currentQuestion) {
    return <div className="loading">🔌 Loading Circuit Designer...</div>;
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🔌 Circuit Designer Quiz</h1>
        <div className="game-stats">
          <span className="level">Level {level}</span>
          <span className="score">Score: {score}</span>
          <span className="progress">{questionsCorrect}/{totalQuestions} Correct</span>
        </div>
      </div>

      <div className="question-container">
        <h2 className="question">{currentQuestion.task}</h2>
        <p className="description">{currentQuestion.description}</p>
        <div className="ohms-law">
          <small>⚡ Ohm's Law: V = I × R | Power = V × I</small>
        </div>
      </div>

      <div className="circuit-workspace">
        <h3>Circuit Board:</h3>
        {placementMode && (
          <div className="placement-hint">
            💆 Tap anywhere on the board to place {components[selectedComponentType]?.name}
          </div>
        )}
        <div 
          className={`circuit-board ${placementMode ? 'placement-mode' : ''}`}
          ref={circuitBoardRef}
          onClick={handleBoardClick}
        >
          {userCircuit.length === 0 ? (
            <div className="empty-board">
              <div className="board-hint">
                {placementMode 
                  ? `💆 Tap to place ${components[selectedComponentType]?.name}` 
                  : '👇 Select components below to start building'
                }
              </div>
            </div>
          ) : (
            <>
              {/* Render connections as SVG lines */}
              <svg className="connection-layer" width="100%" height="100%">
                {connections.map(connection => {
                  const fromComponent = userCircuit.find(c => c.id === connection.from);
                  const toComponent = userCircuit.find(c => c.id === connection.to);
                  if (!fromComponent || !toComponent) return null;
                  
                  return (
                    <g key={connection.id}>
                      {/* Thick invisible clickable area */}
                      <line
                        x1={fromComponent.x + 40}
                        y1={fromComponent.y + 40}
                        x2={toComponent.x + 40}
                        y2={toComponent.y + 40}
                        stroke="transparent"
                        strokeWidth="20"
                        className="connection-hit-area"
                        onClick={() => removeConnection(connection.id)}
                        onTouchEnd={() => removeConnection(connection.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      {/* Visible connection line */}
                      <line
                        x1={fromComponent.x + 40}
                        y1={fromComponent.y + 40}
                        x2={toComponent.x + 40}
                        y2={toComponent.y + 40}
                        stroke="#FFD700"
                        strokeWidth="4"
                        className="connection-line"
                        style={{ pointerEvents: 'none' }}
                      />
                      {/* Connection indicators */}
                      <circle
                        cx={fromComponent.x + 40}
                        cy={fromComponent.y + 40}
                        r="3"
                        fill="#FFD700"
                        style={{ pointerEvents: 'none' }}
                      />
                      <circle
                        cx={toComponent.x + 40}
                        cy={toComponent.y + 40}
                        r="3"
                        fill="#FFD700"
                        style={{ pointerEvents: 'none' }}
                      />
                    </g>
                  );
                })}
              </svg>
              
              {/* Render components */}
              {userCircuit.map(component => (
                <TouchComponent
                  key={component.id}
                  component={component}
                  onRemove={removeComponent}
                  onSelect={handleComponentSelection}
                  isSelected={selectedComponents.includes(component.id)}
                  wireMode={wireMode}
                  componentData={components[component.type]}
                />
              ))}
            </>
          )}
        </div>
        
        {wireMode && (
          <div className="connection-hint">
            {selectedComponents.length === 0 && '🔌 Tap two components to connect them with wire'}
            {selectedComponents.length === 1 && `🔌 Selected: ${components[userCircuit.find(c => c.id === selectedComponents[0])?.type]?.name}. Tap another component to connect.`}
            {selectedComponents.length === 2 && '✅ Wire connected! Select more components to continue wiring.'}
          </div>
        )}
      </div>

      <div className="component-selector">
        <h3>Select Component:</h3>
        <div className="component-grid">
          {Object.entries(components).map(([type, comp]) => (
            <button
              key={type}
              className={`component-btn ${selectedComponentType === type ? 'selected' : ''} ${placementMode && selectedComponentType === type ? 'placing' : ''}`}
              onClick={() => selectComponentForPlacement(type)}
              disabled={showResult}
              style={{ borderColor: comp.color }}
            >
              <span className="component-symbol">{comp.symbol}</span>
              <span className="component-name">{comp.name}</span>
              {comp.voltage && <small className="component-spec">{comp.voltage}V</small>}
              {comp.resistance && <small className="component-spec">{comp.resistance}Ω</small>}
            </button>
          ))}
        </div>
      </div>

      <div className="circuit-info">
        <div className="info-row">
          <span>Components: {userCircuit.length}/{currentQuestion.minComponents}</span>
          <span>Connections: {connections.length}</span>
        </div>
        <div className="required-components">
          <strong>Required:</strong> {currentQuestion.requiredComponents.map(comp => components[comp].name).join(', ')}
        </div>
        <div className="instructions">
          <small>
            📍 <strong>How to use:</strong> Tap components to select, tap board to place, tap connection points to wire
          </small>
        </div>
      </div>

      <div className="controls">
        <button 
          className="clear-btn" 
          onClick={() => {
            setUserCircuit([]);
            setConnections([]);
            setWireMode(false);
            setSelectedComponents([]);
            setPlacementMode(false);
            setSelectedComponentType(null);
          }}
          disabled={showResult || (userCircuit.length === 0 && connections.length === 0)}
        >
          🗑️ Clear
        </button>
        
        {placementMode && (
          <button 
            className="cancel-btn"
            onClick={() => {
              setPlacementMode(false);
              setSelectedComponentType(null);
              setWireMode(false);
              setSelectedComponents([]);
            }}
          >
            ❌ Cancel
          </button>
        )}
        
        <button 
          className={`connect-btn ${wireMode ? 'active' : ''}`}
          onClick={() => {
            if (wireMode) {
              // Exit wire mode
              setWireMode(false);
              setSelectedComponents([]);
            } else {
              // Enter wire mode
              setWireMode(true);
              setSelectedComponents([]);
              setPlacementMode(false);
              setSelectedComponentType(null);
            }
          }}
          disabled={showResult || userCircuit.length < 2}
        >
          {wireMode ? '❌ Exit Wire Mode' : '🔗 Wire Mode'}
        </button>
        
        {wireMode && (
          <>
            <button 
              className="clear-selection-btn"
              onClick={clearWireSelections}
              disabled={selectedComponents.length === 0}
            >
              🗋 Clear Selection
            </button>
            <button 
              className="undo-wire-btn"
              onClick={deleteLastConnection}
              disabled={connections.length === 0}
            >
              ↶ Undo Wire
            </button>
          </>
        )}
        
        <button 
          className="submit-btn" 
          onClick={submitAnswer}
          disabled={showResult || userCircuit.length < currentQuestion.minComponents}
        >
          ⚡ Test
        </button>
      </div>

      {showResult && (
        <div className="result-container">
          <div className={`feedback ${feedback.includes('Excellent') ? 'correct' : 'incorrect'}`}>
            {feedback.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <button className="next-btn" onClick={startNewQuestion}>
            ➡️ Next Challenge
          </button>
        </div>
      )}

      <div className="circuit-tips">
        <h4>💡 Circuit Building Tips:</h4>
        <div className="tips-grid">
          <div className="tip">
            <strong>Series:</strong> Components in a line - current flows through each one
          </div>
          <div className="tip">
            <strong>Parallel:</strong> Components side by side - current splits between paths
          </div>
          <div className="tip">
            <strong>Resistance:</strong> Higher resistance = less current = dimmer bulbs
          </div>
          <div className="tip">
            <strong>Voltage:</strong> More batteries = higher voltage = brighter bulbs
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;