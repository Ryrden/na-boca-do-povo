import { useQuasar, QSpinnerGears } from 'quasar';
import { QNotifyOptions } from 'quasar';

function useNotify() {
  const $q = useQuasar();

  const notifySuccess = (
    message = 'Sucesso! :)',
    displayDurationInMiliseconds = 1500
  ): void => {
    const options: QNotifyOptions = {
      message: message,
      color: 'positive',
      timeout: displayDurationInMiliseconds,
    };
    $q.notify(options);
  };

  const notifyError = (
    message = 'Algo de errado ocorreu, tente novamente mais tarde...',
    displayDurationInMiliseconds = 1500
  ): void => {
    const options: QNotifyOptions = {
      message: message,
      color: 'negative',
      timeout: displayDurationInMiliseconds,
    };
    $q.notify(options);
  };

  const notifyWarning = (
    message = 'Algo de errado ocorreu, tente novamente mais tarde...',
    displayDurationInMiliseconds = 1500
  ): void => {
    const options: QNotifyOptions = {
      message: message,
      color: 'warning',
      textColor: 'black',
      timeout: displayDurationInMiliseconds,
    };
    $q.notify(options);
  };

  const notifyInfo = (
    message = 'Informação! :)',
    displayDurationInMiliseconds = 500
  ): void => {
    const options: QNotifyOptions = {
      message: message,
      spinner: QSpinnerGears,
      timeout: displayDurationInMiliseconds,
    };
    $q.notify(options);
  };

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
}

export { useNotify };
