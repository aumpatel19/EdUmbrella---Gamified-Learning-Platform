import React from 'react';
import styled from 'styled-components';

// Minimal compatibility shim for components importing `buttonVariants`
export const buttonVariants = ({ variant, size, className } = {}) => {
  const variants = {
    default: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
    outline: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
    ghost: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
    hero: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium gradient-primary text-primary-foreground h-10 px-4 py-2",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const base = variants[variant ?? "default"] ?? variants.default;
  const sz = sizes[size ?? "default"] ?? sizes.default;
  return [base, sz, className].filter(Boolean).join(" ");
};

const StyledWrapper = styled.div`
  button {
    font-family: inherit;
    font-size: 20px;
    background: royalblue;
    color: white;
    padding: 0.7em 1em;
    padding-left: 0.9em;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
  }

  button[data-size='sm'] {
    font-size: 16px;
    padding: 0.4em 0.75em;
    padding-left: 0.6em;
    border-radius: 12px;
  }

  button[data-size='icon'] {
    padding: 0.35em;
    width: 2.25rem;
    height: 2.25rem;
    min-width: 2.25rem;
    border-radius: 10px;
    justify-content: center;
  }

  button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
  }

  button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }

  button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  button:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
  }

  button:hover span {
    transform: translateX(5em);
  }

  button:active {
    transform: scale(0.95);
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }

    to {
      transform: translateY(-0.1em);
    }
  }
`;

const Button = ({ children, className, variant, size, ...props }) => {
  // Don't forward `variant` and `size` to the DOM element
  const childArray = React.Children.toArray(children);
  const hasElementChild = childArray.some((c) => React.isValidElement(c));

  return (
    <StyledWrapper>
      <button data-size={size} className={className} {...props}>
        {hasElementChild ? (
          // If consumer provided elements (like an icon + text), render them as-is
          children
        ) : (
          // Otherwise render the default SVG + text layout
          <>
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
                </svg>
              </div>
            </div>
            <span>{children ?? 'Send'}</span>
          </>
        )}
      </button>
    </StyledWrapper>
  );
};

export { Button };
export default Button;
