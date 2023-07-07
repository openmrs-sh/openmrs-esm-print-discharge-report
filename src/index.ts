/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */
import { getAsyncLifecycle, defineConfigSchema } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";

const moduleName = "@openmrs/esm-print-discharge-report-app";

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

/**
 * This function performs any setup that should happen at microfrontend
 * load-time (such as defining the config schema) and then returns an
 * object which describes how the React application(s) should be
 * rendered.
 */
export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

/**
 * The following are named exports for the extensions defined in this frontend modules. See the `routes.json` file to see how these are used.
 */
export const printDischargeReportActionButton = getAsyncLifecycle(
  () => import("./patient-actions-buttons/print-discharge-report.component"),
  {
    featureName: "patient-actions-slot",
    moduleName,
  }
);

export const printDischargeReportDialog = getAsyncLifecycle(
  () => import("./visit/print-discharge-report-dialog.component"),
  {
    featureName: "print discharge report visit",
    moduleName,
  }
);

export const visitDetailOverviewPrintButton = getAsyncLifecycle(
  () => import("./visit/visit-detail-overview-print-button.component"),
  {
    featureName: "visits-detail-slot",
    moduleName,
  }
);

export const admissionIdTag = getAsyncLifecycle(
  () => import("./visit/admission-id-tag.component"),
  {
    featureName: "admission-id-tag",
    moduleName,
  }
);
