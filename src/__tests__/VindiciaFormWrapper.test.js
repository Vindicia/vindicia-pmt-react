import React from 'react';
import Enzyme, { mount, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VindiciaFormWrapper from '../components/VindiciaFormWrapper';

Enzyme.configure({ adapter: new Adapter() });

describe('VindiciaFormWrapper', () => {
  const vindiciaObj = {
    setup: jest.fn(),
    destroy: jest.fn()
  };
  const fields = [
    { type: 'name' },
    {
      type: 'cardNumber',
      label: 'Credit Card Number',
      placeholder: 'CC Number',
      autocomplete: 'cc-number',
      formatinput: true,
      maskinput: true,
    },
    {
      type: 'expirationDate',
      label: 'Expiration Date',
      placeholder: 'MM/YY',
      format: 'MM/YY',
      autocomplete: 'cc-exp',
      formatinput: true,
      maskinput: true,
    },
    {
      type: 'cvn',
      label: 'CVN',
      placeholder: 'CVN',
      autocomplete: 'cc-csc',
    },
  ];
  it('should render without throwing an error', () => {
    const wrapper = mount(
      <VindiciaFormWrapper
        fields={fields}
        vindicia={vindiciaObj}
      />
    );
    expect(wrapper.exists('#mainForm')).toBe(true);
  });

  it('should unmount and destroy itself', () => {
    const wrapper = mount(<VindiciaFormWrapper
      fields={fields}
      vindicia={vindiciaObj}
    />);
    expect(vindiciaObj.setup).toHaveBeenCalled();
    wrapper.unmount();
    expect(vindiciaObj.destroy).toHaveBeenCalled();
  });

  it('should load fields and change field value', () => {
    const wrapper = mount(<VindiciaFormWrapper
      fields={fields}
      vindicia={vindiciaObj}
    />);
    console.log(wrapper.debug());
  });
});
