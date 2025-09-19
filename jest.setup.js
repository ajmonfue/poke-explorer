import '@testing-library/jest-dom'

// Jest setup file
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: () => false,
})

Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
  value: () => {},
})

Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  value: () => {},
})

if (!Element.prototype.scrollIntoView) {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    value: jest.fn(), // o () => {}
    writable: true,
    configurable: true,
  })
}