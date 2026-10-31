import { Component, type ReactNode } from 'react';

/** Keeps a decorative part (the 3D scene) from taking the page down: if it throws, nothing is shown in its place. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
