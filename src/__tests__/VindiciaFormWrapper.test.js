import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VindiciaFormWrapper from '../components/VindiciaFormWrapper';

Enzyme.configure({ adapter: new Adapter() });

describe('VindiciaFormWrapper', () => {
  const vindiciaObj = {
    setup: jest.fn(),
    destroy: jest.fn(),
    isValid: jest.fn(),
    clearData: jest.fn(),
    resetCompleteStatus: jest.fn()
  };
  const fields = [
    { type: 'text', label: 'Name', name: 'cardholder-name' },
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
  const options = {
    hmac: '12345',
    vindiciaAuthId: '12345'
  };
  it('should render without throwing an error', () => {
    const wrapper = mount(
      <VindiciaFormWrapper
        fields={fields}
        vindicia={vindiciaObj}
        options={options}
      />
    );
    console.log(wrapper.debug());
    expect(wrapper.exists('#mainForm')).toBe(true);
  });

  it('should unmount and destroy itself', () => {
    const wrapper = mount(<VindiciaFormWrapper
      fields={fields}
      vindicia={vindiciaObj}
      options={options}
    />);
    expect(vindiciaObj.setup).toHaveBeenCalled();
    wrapper.unmount();
    expect(vindiciaObj.destroy).toHaveBeenCalled();
  });

  it('should generate default fields when no fields are passed in', () => {
    const wrapper = mount(<VindiciaFormWrapper
      vindicia={vindiciaObj}
      options={options}
    />);

    // default fields at this time: cardNumber, expirationDate, cvn
    
    expect(wrapper.state('localOptions')['hostedFields']['cardNumber']).toBeTruthy();
    expect(wrapper.state('localOptions')['hostedFields']['expirationDate']).toBeTruthy();
    expect(wrapper.state('localOptions')['hostedFields']['cvn']).toBeTruthy();
  });

  it('should load fields and change field value in state', () => {
    const nameValue = 'Hans Christian Anderson';
    const wrapper = mount(<VindiciaFormWrapper
      fields={fields}
      vindicia={vindiciaObj}
      options={options}
    />);

    expect(wrapper.state('formFields')).toEqual({
      'cardholder-name': ''
    });
    
    wrapper.find('#cardholder-name').simulate('change', {
      target: { value: nameValue }
    });
    
    expect(wrapper.state('formFields')).toEqual({
      'cardholder-name': nameValue
    });
  });

  it('should allow submit only when form is valid', () => {
    const mockSubmit = jest.fn();

    const wrapper = mount(<VindiciaFormWrapper
      fields={fields}
      vindicia={vindiciaObj}
      onSubmitEvent={mockSubmit}
      options={options}
    />);

    expect(wrapper.find('button').prop('disabled')).toEqual(true);

    wrapper.setState({isValid: true});
    
    expect(wrapper.find('button').prop('disabled')).toEqual(false);
    expect(wrapper.state('submitInProgress')).toEqual(false);

    // simulate form submission
    wrapper.instance().onSubmit();

    expect(wrapper.state('submitInProgress')).toEqual(true);
    expect(mockSubmit.mock.calls.length).toEqual(1);
  });

  it('should call passed in props on prop events', () => {
    const mockFieldChange = jest.fn(),
          mockSubmitComplete = jest.fn(),
          mockSubmitFail = jest.fn(),
          mockSubmit = jest.fn();

    const wrapper = mount(<VindiciaFormWrapper
      fields={fields}
      vindicia={vindiciaObj}
      onSubmitEvent={mockSubmit}
      onSubmitCompleteEvent={mockSubmitComplete}
      onSubmitCompleteFailedEvent={mockSubmitFail}
      onVindiciaFieldEvent={mockFieldChange}
      options={options}
    />);

    wrapper.instance().onVindiciaFieldChange();
    expect(mockFieldChange.mock.calls.length).toEqual(1);

    wrapper.instance().onSubmit();
    expect(mockSubmit.mock.calls.length).toEqual(1);

    wrapper.instance().onSubmitComplete();
    expect(mockSubmitComplete.mock.calls.length).toEqual(1);

    wrapper.instance().onSubmitFail();
    expect(mockSubmitFail.mock.calls.length).toEqual(1);
  });

  it('should make use of resetVindicia', () => {
    const wrapper = mount(<VindiciaFormWrapper
      fields={fields}
      vindicia={vindiciaObj}
      options={options}
    />);

    const startingHash = wrapper.state('sessionHash');

    wrapper.instance().resetVindicia();

    expect(wrapper.state('sessionHash')).not.toEqual(startingHash);


  });
});
