import React, { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
// toast removed to avoid dependency for now

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, info)
    // toast.error('Something went wrong. Please refresh the page.')
  }

  render() {
    if (this.state.hasError) {
      return <p className="p-4 text-center text-red-500">Something went wrong.</p>
    }

    return this.props.children
  }
} 