import { Job } from 'bull';
import { logger, notificationUtil } from '@work-whiz/utils';
import { authenticationQueue } from '@work-whiz/queues';
import { authenticationTemplate } from '@work-whiz/templates';
import { IEmailJob } from '@work-whiz/interfaces/queues';

const TEMPLATE_NAMES = {
  PASSWORD_RESET: 'password_reset',
  PASSWORD_SETUP: 'password_setup',
  PASSWORD_UPDATE: 'password_update',
} as const;

authenticationQueue.process(async (job: Job<IEmailJob>) => {
  const { email, subject, template } = job.data;
  const jobId = job.id;

  try {
    let html_template: string | undefined;

    if (template?.name) {
      switch (template.name) {
        case TEMPLATE_NAMES.PASSWORD_RESET:
          html_template = authenticationTemplate.passwordReset(
            template.content?.uri,
            template.content?.username
          );
          break;
        case TEMPLATE_NAMES.PASSWORD_SETUP:
          html_template = authenticationTemplate.passwordSetup(
            template.content?.uri,
            template.content?.username
          );
          break;
        case TEMPLATE_NAMES.PASSWORD_UPDATE:
          html_template = authenticationTemplate.passwordUpdate(
            template.content?.username,
            template.content?.device
          );
          break;
        default:
          logger.warn(
            `Unknown template name in job ${jobId}: ${template.name}`
          );
      }
    }

    await notificationUtil.sendEmail(email, subject, html_template);

    logger.info(`Email successfully sent in job ${jobId}`, {
      email,
      subject,
      template: template?.name,
    });
  } catch (error) {
    logger.error(`Failed to process job ${jobId}`, {
      email,
      subject,
      error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
});
