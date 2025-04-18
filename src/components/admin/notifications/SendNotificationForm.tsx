
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Schema for form validation
const notificationSchema = z.object({
  title: z.string().min(3, {
    message: "Заглавието трябва да бъде поне 3 символа.",
  }).max(50, {
    message: "Заглавието не може да бъде повече от 50 символа.",
  }),
  message: z.string().min(10, {
    message: "Съобщението трябва да бъде поне 10 символа.",
  }).max(1000, {
    message: "Съобщението не може да бъде повече от 1000 символа.",
  }),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export const SendNotificationForm = () => {
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<any>(null)
  
  // Initialize form
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      message: '',
    },
  });

  const onSubmit = async (data: NotificationFormData) => {
    try {
      setIsSending(true)
      setApiError(null)
      setLastResponse(null)
      
      console.log('Sending notification:', data);
      
      const { data: response, error } = await supabase.functions.invoke('send-notification', {
        body: { title: data.title, message: data.message }
      })

      if (error) {
        console.error('Supabase function error:', error);
        setApiError(`Error calling Supabase function: ${error.message}`);
        throw new Error(error.message);
      }

      // Store the complete response for debugging
      setLastResponse(response);
      console.log('OneSignal API response:', response);

      if (response.error) {
        console.error('OneSignal API error:', response.error);
        setApiError(`OneSignal API error: ${JSON.stringify(response.error)}`);
        throw new Error(typeof response.error === 'string' ? response.error : JSON.stringify(response.error));
      }

      toast({
        title: "Успешно изпратено",
        description: `Известието е изпратено до ${response.result?.recipients || 0} абонирани потребители.`,
      })
      
      form.reset();
    } catch (error) {
      console.error('Error sending notification:', error)
      toast({
        title: "Грешка",
        description: "Възникна проблем при изпращането на известието: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {apiError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}
        
        {lastResponse && lastResponse.success && (
          <Alert className="mb-6">
            <AlertDescription>
              Известието е изпратено успешно до {lastResponse.result?.recipients || 0} абонирани потребители.
              {lastResponse.result?.id && ` ID на известието: ${lastResponse.result.id}`}
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заглавие</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Заглавие на известието" 
                      {...field} 
                      disabled={isSending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Съдържание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Съдържание на известието"
                      className="min-h-[120px]"
                      {...field}
                      disabled={isSending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isSending} 
              className="w-full"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Изпращане...
                </>
              ) : (
                "Изпрати известие"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
