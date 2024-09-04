import { useForm } from 'react-hook-form';
import { actions } from 'astro:actions';
import ContactGate from './contact-gate';

interface IFormInputs {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<IFormInputs>({
    mode: 'onChange',
  });

  const onSubmit = async (data: IFormInputs) => {
    throw Error('Error submitting form');
  };

  const inputClass =
    'rounded-lg border border-transparent bg-[#F0F1F2] p-4 text-[#434343] outline-none placeholder:text-[#9A9EA6] focus:border-black md:px-6 md:py-4';
  const errorClass = '!border-[#DC2626] !bg-[#FFF9F9]';

  return (
    <>
      <div
        className={`absolute left-0 right-0 top-0 z-10 flex flex-col justify-start ${isSubmitSuccessful ? 'bottom-[calc(43%)] sm:bottom-[calc(46%)]' : ''}`}
      >
        <div
          className={`flex w-full flex-col justify-end bg-white transition-all duration-[5000ms] ${isSubmitSuccessful ? 'h-full' : 'h-0'}`}
        >
          <p
            className={`-translate-y-2 text-3xl transition-all delay-[3000ms] duration-1000 md:text-4xl lg:text-5xl ${isSubmitSuccessful ? 'opacity-100' : 'opacity-0'}`}
          >
            Message received!
          </p>
        </div>
        <div>
          <ContactGate position="top" />
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 z-10 flex flex-col justify-end ${isSubmitSuccessful ? 'top-[calc(43%)] sm:top-[calc(45%)]' : ''}`}
      >
        <div>
          <ContactGate position="bottom" />
        </div>
        <div
          className={`w-full bg-white transition-all duration-[5000ms] ${isSubmitSuccessful ? 'h-full' : 'h-0'}`}
        >
          <p
            className={`text-3xl transition-all delay-[3000ms] duration-1000 md:text-4xl lg:text-5xl ${isSubmitSuccessful ? 'opacity-100' : 'opacity-0'}`}
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
          {/* <input
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
          <input
            {...register('phone', {
              required: 'Phone number is required',
              pattern: { value: /^(\+\d{1,3}[- ]?)?\d{10}$/, message: 'Invalid phone number' },
            })}
            type="tel"
            placeholder="Phone Number"
            className={`${inputClass} ${errors.phone ? errorClass : ''}`}
          />
          <textarea
            {...register('message', { required: 'Message is required' })}
            placeholder="Message"
            rows={5}
            className={`${inputClass} ${errors.message ? errorClass : ''}`}
          ></textarea> */}
        </div>

        <button type="submit" className="btn">
          Let's Chat
        </button>
      </form>
    </>
  );
}
