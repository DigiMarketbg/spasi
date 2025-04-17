
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface NotificationFormData {
  title: string
  message: string
}

export const SendNotificationForm = () => {
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)
  const { register, handleSubmit, reset } = useForm<NotificationFormData>()

  const onSubmit = async (data: NotificationFormData) => {
    try {
      setIsSending(true)
      
      const { data: response, error } = await supabase.functions.invoke('send-notification', {
        body: { title: data.title, message: data.message }
      })

      if (error) throw error

      toast({
        title: "Успешно изпратено",
        description: "Известието е изпратено до всички абонирани потребители.",
      })
      
      reset()
    } catch (error) {
      console.error('Error sending notification:', error)
      toast({
        title: "Грешка",
        description: "Възникна проблем при изпращането на известието.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Изпращане на известие</CardTitle>
        <CardDescription>
          Изпратете push известие до всички абонирани потребители
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Заглавие на известието"
              {...register('title', { required: true })}
            />
          </div>
          <div>
            <Textarea
              placeholder="Съдържание на известието"
              className="min-h-[100px]"
              {...register('message', { required: true })}
            />
          </div>
          <Button type="submit" disabled={isSending}>
            {isSending ? "Изпращане..." : "Изпрати известие"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
