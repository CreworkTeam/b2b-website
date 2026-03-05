import { useForm } from 'react-hook-form';
import { useState } from 'react';
import React from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { actions } from 'astro:actions';
import ContactGate from './contact-gate';

interface IFormInputs {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    mode: 'onChange',
  });

  const onSubmit = async (data: IFormInputs) => {
    if (phone.replace(/\D/g, '').length < 8) {
      setPhoneError('Please enter a valid phone number');
      return;
    }
    setPhoneError('');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      formData.append('phone', phone);
      await actions.contact(formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const inputClass =
    'rounded-lg border border-transparent bg-[#F0F1F2] p-4 text-[#434343] outline-none placeholder:text-[#9A9EA6] focus:border-black md:px-6 md:py-4';
  const errorClass = '!border-[#DC2626] !bg-[#FFF9F9]';

  return (
    <>
      <div
        className={`absolute left-0 right-0 top-0 z-10 flex flex-col justify-start ${submitted ? 'bottom-[calc(43%)] sm:bottom-[calc(46%)]' : ''}`}
      >
        <div
          className={`flex w-full flex-col justify-end bg-white transition-all duration-[5000ms] ${submitted ? 'h-full' : 'h-0'}`}
        >
          <p
            className={`-translate-y-2 text-3xl transition-all delay-[3000ms] duration-1000 md:text-4xl lg:text-5xl ${submitted ? 'opacity-100' : 'opacity-0'}`}
          >
            Message received!
          </p>
        </div>
        <div>
          <ContactGate position="top" />
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 flex flex-col justify-end ${submitted ? 'top-[calc(43%)] sm:top-[calc(45%)]' : ''}`}
      >
        <div>
          <ContactGate position="bottom" />
        </div>
        <div
          className={`w-full bg-white transition-all duration-[5000ms] ${submitted ? 'h-full' : 'h-0'}`}
        >
          <p
            className={`text-3xl transition-all delay-[3000ms] duration-1000 md:text-4xl lg:text-5xl ${submitted ? 'opacity-100' : 'opacity-0'}`}
          >
            Our team will reach out shortly
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto flex w-full flex-col justify-between gap-2 px-4 text-sm sm:text-base md:max-w-sm md:gap-4"
      >
        <div className="flex flex-col justify-between gap-2 md:gap-4">
          <input
            {...register('name', {
              required: 'Name is required',
              pattern: { value: /^[a-zA-Z\s]*$/, message: 'Invalid name' },
            })}
            type="text"
            placeholder="Name"
            className={`${inputClass} ${errors.name ? errorClass : ''}`}
          />
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
            })}
            type="email"
            placeholder="Email"
            className={`${inputClass} ${errors.email ? errorClass : ''}`}
          />
          <div>
            <PhoneInput
              defaultCountry="in"
              value={phone}
              placeholder="Phone Number"
              onChange={(val) => {
                setPhone(val);
                if (phoneError) setPhoneError('');
              }}
              style={
                {
                  '--react-international-phone-height': 'auto',
                  '--react-international-phone-border-radius': '0.5rem',
                  '--react-international-phone-border-color': 'transparent',
                  '--react-international-phone-background-color': '#F0F1F2',
                  '--react-international-phone-text-color': '#434343',
                  '--react-international-phone-selected-dropdown-item-background-color': '#F0F1F2',
                  '--react-international-phone-font-size': 'inherit',
                } as React.CSSProperties
              }
              inputStyle={{
                width: '100%',
                padding: '1rem 1rem 1rem 0.5rem',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 'inherit',
                color: '#434343',
                lineHeight: '1.5',
              }}
              countrySelectorStyleProps={{
                buttonStyle: {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 0.75rem 0 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderRight: '1px solid #D1D5DB',
                  height: '100%',
                },
              }}
              className={`flex w-full items-center rounded-lg border border-transparent bg-[#F0F1F2] focus-within:border-black ${phoneError ? '!border-[#DC2626] !bg-[#FFF9F9]' : ''}`}
            />
            {phoneError && <p className="mt-1 text-xs text-[#DC2626]">{phoneError}</p>}
          </div>
          <textarea
            {...register('message', { required: 'Message is required' })}
            placeholder="Message"
            rows={5}
            className={`${inputClass} ${errors.message ? errorClass : ''}`}
          ></textarea>
        </div>

        <button type="submit" className="btn">
          Let's Chat
        </button>
      </form>
    </>
  );
}
