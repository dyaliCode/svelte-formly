import Component from '../src/Component.svelte'
import { render, cleanup } from '@testing-library/svelte'
import '@testing-library/jest-dom/extend-expect'
import fetchMock from 'fetch-mock'

describe('App', () => {
  beforeEach(() => {
    cleanup()
  })

  afterEach(() => {
    fetchMock.reset()
  })

  test('should render greeting', () => {
    const { getByText } = render(Component, { props: {} })

    expect(getByText(`Hello, I'm a component!`))
  })
})
