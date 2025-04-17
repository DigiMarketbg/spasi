
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { SendNotificationForm } from '@/components/admin/notifications/SendNotificationForm'

const NotificationsTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на известия</CardTitle>
        <CardDescription>
          Изпращайте push известия до всички абонирани потребители
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SendNotificationForm />
      </CardContent>
    </Card>
  )
}

export default NotificationsTabContent
