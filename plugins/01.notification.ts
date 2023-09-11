import Notifications from '@kyvg/vue3-notification'
import { useNotification } from '@kyvg/vue3-notification';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Notifications);
    const notification = useNotification();

    return {
        provide: {
            sendSuccessNotification: (title: string, text: string) => {
                notification.notify({
                    title,
                    text,
                    type: 'success'
                })
            },
            sendWarningNotification: (title: string, text: string) => {
                notification.notify({
                    title,
                    text,
                    type: 'warn'
                });
            },
            sendErrorNotification: (title: string, text: string) => {
                notification.notify({
                    title,
                    text,
                    type: 'error'
                });
            }
        }
    }
});