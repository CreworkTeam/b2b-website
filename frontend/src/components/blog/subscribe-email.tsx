import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { LOOMS_ENDPOINT } from '@/constants.ts';
import { trackNewsletterSignup } from '@/utils/mixpanel';

const formSchema = z.object({
  email: z.string().email(),
});

const SubscribeEmail = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async ({ email }: z.infer<typeof formSchema>) => {
    const formBody = `email=${encodeURIComponent(email)}`;

    trackNewsletterSignup();

    const res = await fetch(LOOMS_ENDPOINT, {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  };

  return (
    <div className="w-full max-w-sm">
      {form.formState.isSubmitSuccessful && (
        <p className="text-xs font-medium text-emerald-600 mb-1.5 text-right">
          Thank you for subscribing!
        </p>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'relative flex w-full items-center rounded-full border border-[#DADCE0] bg-white p-1 pl-4 shadow-sm transition-all hover:shadow-md hover:border-gray-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10',
            {
              'border-red-500': form.formState.errors.email,
            }
          )}
        >
          <svg
            className="w-4 h-4 text-gray-400 shrink-0 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1 m-0 space-y-0">
                <FormControl>
                  <Input
                    placeholder="Enter your email..."
                    className="w-full border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm text-gray-900 placeholder:text-gray-400 h-9 p-0"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            disabled={
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              form.formState.isSubmitSuccessful
            }
            className={cn(
              'bg-black text-white hover:bg-neutral-800 text-xs sm:text-sm px-5 py-2 h-9 rounded-full font-medium shrink-0 transition-all shadow-sm ml-1',
              {
                'bg-emerald-600 hover:bg-emerald-600 text-white !opacity-100': form.formState.isSubmitSuccessful,
              }
            )}
            data-btntype="email"
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <span>Subscribing</span>
                <svg className="w-4 h-4 ml-1.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </>
            ) : form.formState.isSubmitSuccessful ? (
              <>
                <span>Subscribed</span>
                <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SubscribeEmail;
