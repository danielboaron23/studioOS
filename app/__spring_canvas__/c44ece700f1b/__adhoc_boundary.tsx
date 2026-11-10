// GENERATED — ad-hoc Spring canvas error boundary. Do not edit.
// Renders the data-adhoc-rev root in BOTH the ok and the error (fallback) branch, so the
// render oracle reads the rev back even when the wrapped state render threw.
/* eslint-disable */
"use client";
import * as React from "react";

export class SpringCanvasBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { didError: false };
  }
  static getDerivedStateFromError() {
    return { didError: true };
  }
  render() {
    // The rev marker is on the root in EITHER branch — outside the throwing children.
    return (
      <div data-adhoc-rev="c44ece700f1b" data-spring-canvas="page">
        {this.state.didError ? (
          <div role="alert" data-adhoc-state="error">Ad-hoc render error.</div>
        ) : (
          this.props.children
        )}
      </div>
    );
  }
}
