import { useQuasar } from 'quasar';
import { QNotifyOptions } from 'quasar';

function useNotify() {
  const $q = useQuasar();

  const notifySuccess = (
    message = 'Sucesso! :)',
    displayDurationInMiliseconds = 1000
  ): void => {
    const options: QNotifyOptions = {
      type: 'positive',
      message: message,
      timeout: displayDurationInMiliseconds,
    };
    $q.notify(options);
  };

  const notifyError = (
    message = 'Algo de errado ocorreu, tente novamente mais tarde...',
    displayDurationInMiliseconds = 1000
  ): void => {
    const options: QNotifyOptions = {
      type: 'negative',
      message: message,
      timeout: displayDurationInMiliseconds,
    };
    $q.notify(options);
  };

  return {
    notifySuccess,
    notifyError,
  };
}

export { useNotify };
