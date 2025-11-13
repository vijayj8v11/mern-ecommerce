import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test component to verify React testing setup
const TestComponent = () => {
  return (
    <div>
      <h1>MERN E-commerce</h1>
      <p data-testid="welcome-message">Welcome to our online store!</p>
      <button data-testid="test-button">Shop Now</button>
    </div>
  );
};

describe('React Testing Setup', () => {
  test('renders test component with title', () => {
    render(<TestComponent />);
    const titleElement = screen.getByText(/MERN E-commerce/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders welcome message', () => {
    render(<TestComponent />);
    const welcomeElement = screen.getByTestId('welcome-message');
    expect(welcomeElement).toBeInTheDocument();
    expect(welcomeElement).toHaveTextContent('Welcome to our online store!');
  });

  test('renders shop button', () => {
    render(<TestComponent />);
    const buttonElement = screen.getByTestId('test-button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Shop Now');
  });

  test('component structure is correct', () => {
    const { container } = render(<TestComponent />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(container.querySelector('button')).toBeInTheDocument();
  });
});
