import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    
    console.error("error: ", error, errorInfo);//logging error
  }
  render() {
    if (this.state.hasError) {
      return <h1>Error</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;