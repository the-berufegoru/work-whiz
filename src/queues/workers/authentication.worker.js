// import { Job } from 'bull';
// import path from 'path';
// import ejs from 'ejs';
// import { logger, notificationUtil } from '@work-whiz/utils';
// import { authenticationQueue } from '@work-whiz/queues';
// import { IEmailJob } from '@work-whiz/interfaces/queues';
// import { config } from '@work-whiz/configs/config';

// const TEMPLATES_DIR = path.join(__dirname, '../templates/authentication');

// const TEMPLATE_MAP = {
//   password_reset: 'password-reset.ejs',
//   password_setup: 'password-setup.ejs',
//   password_update: 'password-update.ejs',
// } as const;

// authenticationQueue.process(async (job: Job<IEmailJob>) => {
//   const { email, subject, template } = job.data;
//   const jobId = job.id;

//   try {
//     const templateFile = TEMPLATE_MAP[template.name];
//     if (!templateFile) {
//       throw new Error(`Unsupported template type: ${template.name}`);
//     }

//     const templatePath = path.join(TEMPLATES_DIR, templateFile);

//     // Render the EJS template
//     const html = await ejs.renderFile(templatePath, {
//       ...template.content,
//       appName: config.notification.mailgen.product.name,
//     });

//     await notificationUtil.sendEmail(email, subject, html);

//     logger.info(`Email successfully sent in job ${jobId}`, {
//       email,
//       subject,
//       template: template.name,
//     });
//   } catch (error) {
//     logger.error(`Failed to process job ${jobId}`, {
//       email,
//       subject,
//       error: error instanceof Error ? error.message : String(error),
//       stack: error instanceof Error ? error.stack : undefined,
//     });
//     throw error;
//   }
// });
