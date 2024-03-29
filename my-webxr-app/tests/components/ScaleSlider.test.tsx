import {
  render, fireEvent, cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Mock, beforeEach } from 'vitest';
import ScaleSlider from '../../src/components/ScaleSlider';

describe('ScaleSlider', () => {
  let setScale: Mock;

  beforeEach(() => {
    setScale = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly with initial scale', () => {
    const { getByTestId } = render(<ScaleSlider scale={50} setScale={setScale} />);

    expect(getByTestId('ScaleSliderComponent')).toBeInTheDocument();
    expect(getByTestId('ScaleSliderComponent')).not.toBeEmptyDOMElement();
    expect(getByTestId('slider')).toHaveValue(String(50));
    expect(getByTestId('text')).toHaveTextContent('Scale: 50');
    expect(setScale).not.toHaveBeenCalled();
  });

  it('calls setScale with correct value when slider changes', () => {
    const { getByTestId } = render(<ScaleSlider scale={50} setScale={setScale} />);

    const slider = getByTestId('slider');
    fireEvent.change(slider, { target: { value: '70' } });

    expect(setScale).toHaveBeenCalledWith(70);
  });

  it('handles minimum scale value correctly', () => {
    const { getByTestId } = render(<ScaleSlider scale={50} setScale={setScale} />);

    const slider = getByTestId('slider');
    fireEvent.change(slider, { target: { value: '10' } });

    expect(setScale).toHaveBeenCalledWith(10);
  });

  it('handles maximum scale value correctly', () => {
    const { getByTestId } = render(<ScaleSlider scale={50} setScale={setScale} />);

    const slider = getByTestId('slider');
    fireEvent.change(slider, { target: { value: '100' } });

    expect(setScale).toHaveBeenCalledWith(100);
  });
});
