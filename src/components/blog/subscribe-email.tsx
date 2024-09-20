import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { LOOMS_ENDPOINT } from '@/constants.ts';
import { useState } from 'react';
import { CheckCircle, LoaderCircle } from 'lucide-react';

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

    const res = await fetch(LOOMS_ENDPOINT, {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  };

  return (
    <>
      <p className="text-lg font-medium">
        {form.formState.isSubmitSuccessful
          ? 'Thank you for subscribing!'
          : 'Subscribe to our newsletter'}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('relative flex flex-1 rounded-md border bg-[#F4F4F4]', {
            'border-red-500': form.formState.errors.email,
          })}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    className={'flex-1 border-0 shadow-none focus-visible:ring-0'}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            variant="ghost"
            disabled={
              form.formState.isSubmitting ||
              !form.formState.isValid ||
              form.formState.isSubmitSuccessful
            }
            className={cn('text-sm font-medium', {
              'text-[#219653] !opacity-100': form.formState.isSubmitSuccessful,
            })}
            data-btntype="email"
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <span>Subscribe</span>
                <LoaderCircle className="ml-1 h-4 w-4 animate-spin" />
              </>
            ) : form.formState.isSubmitSuccessful ? (
              <>
                <span>Subscribed</span>
                <CheckCircle className="ml-1 h-4 w-4" />
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SubscribeEmail;
