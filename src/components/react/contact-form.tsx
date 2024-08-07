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
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm<IFormInputs>({
    mode: 'onChange'
  });

  const onSubmit = async (data: IFormInputs) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      const res = await actions.contact(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const inputClass = "rounded-lg border border-transparent bg-[#F0F1F2] p-4 text-[#434343] outline-none placeholder:text-[#9A9EA6] focus:border-black md:px-6 md:py-4";
  const errorClass = "!border-[#DC2626] !bg-[#FFF9F9]";

  return (
    <>
      <div className={`absolute left-0 right-0 top-0 flex flex-col justify-start z-10 ${isSubmitSuccessful ? 'bottom-[calc(43%)]  sm:bottom-[calc(46%)]' : ''}`}>
        <div className={`transition-all w-full duration-[5000ms] flex flex-col justify-end bg-white ${isSubmitSuccessful ? 'h-full' : 'h-0'}`}>
          <p className={`text-3xl md:text-4xl lg:text-5xl transition-all delay-[3000ms] duration-1000 -translate-y-2 ${isSubmitSuccessful ? 'opacity-100' : 'opacity-0'}`}>Message received!</p>
        </div>
        <div>
          <ContactGate position='top' />
        </div>
      </div>
      <div className={`absolute left-0 right-0 bottom-0 flex flex-col justify-end z-10 ${isSubmitSuccessful ? 'top-[calc(43%)]  sm:top-[calc(45%)]' : ''}`}>
        <div>
          <ContactGate position='bottom' />
        </div>
        <div className={`transition-all w-full duration-[5000ms] bg-white ${isSubmitSuccessful ? 'h-full' : 'h-0'}`}>
          <p className={`text-3xl md:text-4xl lg:text-5xl transition-all delay-[3000ms] duration-1000 ${isSubmitSuccessful ? 'opacity-100' : 'opacity-0'}`}>Our team will reach out shortly</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto flex w-full flex-col justify-between gap-2 px-4 text-sm sm:text-base md:max-w-sm md:gap-4"
      >
        <div className="flex flex-col justify-between gap-2 md:gap-4">
          <input
            {...register("name", {
              required: "Name is required",
              pattern: { value: /^[a-zA-Z\s]*$/, message: "Invalid name" }
            })}
            type="text"
            placeholder="Name"
            className={`${inputClass} ${errors.name ? errorClass : ''}`}
          />
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
            })}
            type="email"
            placeholder="Email"
            className={`${inputClass} ${errors.email ? errorClass : ''}`}
          />
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: { value: /^(\+\d{1,3}[- ]?)?\d{10}$/, message: "Invalid phone number" }
            })}
            type="tel"
            placeholder="Phone Number"
            className={`${inputClass} ${errors.phone ? errorClass : ''}`}
          />
          <textarea
            {...register("message", { required: "Message is required" })}
            placeholder="Message"
            rows={5}
            className={`${inputClass} ${errors.message ? errorClass : ''}`}
          ></textarea>
        </div>

        <button
          type="submit"
          className="m-0 rounded-lg border border-[#5C5C5C] px-6 py-3 font-medium text-white disabled:opacity-50"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 7.29%, rgba(255, 255, 255, 0) 65.62%), #000000',
            boxShadow: '0px 3.46304px 8.65761px rgba(0, 0, 0, 0.16), 0px 0px 0px 0.865761px #989898',
          }}
        >
          Let's Chat
        </button>
      </form>
    </>
  );
}