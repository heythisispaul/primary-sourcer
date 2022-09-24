/* eslint-disable react/destructuring-assignment */
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error);
    console.log(errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    // @ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
