import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from "@carbon/react";
import { showNotification, useVisit, Visit } from "@openmrs/esm-framework";
import styles from "./print-discharge-report-dialog.scss";
import Loader from "../loader/loader.component";
import {
  downloadDischargeLetter,
  getDischargeLetterStatus,
  signDischargeLetter as signDischargeLetterApi,
} from "../api/dischargeLetter";
import {
  DocumentStatus,
  getDocumentStatusEnumFromString,
} from "../enums/signStatus";

interface PrintDischargeReportDialogProps {
  patientUuid: string;
  visit: Visit;
  closeModal: () => void;
}

function showInOtherTab(blob) {
  const url = window.URL.createObjectURL(blob);
  window.open(url);
}

const PrintDischargeReportDialog: React.FC<PrintDischargeReportDialogProps> = ({
  patientUuid,
  visit,
  closeModal,
}) => {
  patientUuid = "7b44d1a3-a7a9-4af1-bd2d-97ed0b59b257";
  visit = { uuid: "78888f20-9c5e-44d0-857e-88788b83ad5e" } as any;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSigned, setIsSigned] = useState(false);
  const [noEncounters, setNoEncounters] = useState(false);
  const [signInfo, setSignInfo] = useState({ login: "", password: "" });
  const { currentVisit } = useVisit(patientUuid);

  const showError = useCallback(
    (error) =>
      showNotification({
        title: error?.message,
        kind: "error",
        critical: true,
        description: error?.message,
      }),
    []
  );

  const getDocumentStatus = useCallback(
    () =>
      getDischargeLetterStatus(
        patientUuid,
        visit?.uuid ?? currentVisit?.uuid
      ).subscribe(
        (response) => {
          const status = getDocumentStatusEnumFromString(response.data);
          switch (status) {
            case DocumentStatus.SIGNED:
              setIsLoading(false);
              setIsSigned(true);
              break;
            case DocumentStatus.NO_SIGNED:
              setIsLoading(false);
              setIsSigned(false);
              break;
            case DocumentStatus.SIGNED_REPORT_IN_PROGRESS:
              setTimeout(() => getDocumentStatus(), 5000);
              break;
            case DocumentStatus.SIGNED_REPORT_FAILED:
              showError({ message: "SIGNED_REPORT_FAILED" });
              break;
            default:
              showError({ message: "SIGNED_REPORT_FAILED" });
              break;
          }
        },
        (error) => {
          if (error?.response?.status == 404) {
            setNoEncounters(true);
            setIsLoading(false);
          } else showError(error);
        }
      ),
    [currentVisit?.uuid, patientUuid, showError, visit?.uuid]
  );

  const signDischargeLetter = useCallback(() => {
    setIsLoading(true);
    signDischargeLetterApi(
      signInfo.login,
      signInfo.password,
      patientUuid,
      visit?.uuid ?? currentVisit?.uuid
    ).subscribe(
      (response) => {
        getDocumentStatus();
      },
      (error) => showError(error)
    );
  }, [
    currentVisit?.uuid,
    getDocumentStatus,
    patientUuid,
    showError,
    signInfo.login,
    signInfo.password,
    visit?.uuid,
  ]);

  useEffect(() => {
    getDocumentStatus();
  }, [getDocumentStatus]);

  const printReport = useCallback(() => {
    const printReportPayload = {
      patientUuid,
      visitUuid: visit?.uuid ?? currentVisit?.uuid,
    };

    setIsLoading(true);

    downloadDischargeLetter(
      printReportPayload.patientUuid,
      printReportPayload.visitUuid
    ).subscribe(
      (response) => {
        if (response.status === 200) {
          response.blob().then((blob) => showInOtherTab(blob));
          closeModal();
        }
      },
      (error) => {
        if (error?.response?.status === 404) {
          showNotification({
            title: t(
              "printDischargeReportErrorMessage",
              "There are no gastro encounters for the visit"
            ),
            kind: "warning",
            critical: false,
            description: printReportPayload.visitUuid,
          });
          closeModal();
        } else
          showNotification({
            title: t("printDischargeReportError", "Error print release letter"),
            kind: "error",
            critical: true,
            description: error?.message,
          });
      }
    );
  }, [closeModal, currentVisit?.uuid, patientUuid, t, visit?.uuid]);

  return (
    <div>
      <ModalHeader
        closeModal={closeModal}
        label={t("visit", "Visit")}
        title={t("printDischargeReport", "Print Release Letter")}
      />
      <ModalBody>
        {isLoading ? (
          <Loader />
        ) : (
          <div className={styles.modalBodyContainer}>
            <span className={styles.bodyShort02}>
              {noEncounters
                ? t(
                    "printDischargeReportErrorMessage",
                    "There are no gastro encounters for the visit"
                  )
                : isSigned
                ? t(
                    "printDischargeReportOrSignMessage",
                    "You are going to download release letter for active visit. Also, you can re-sign the document"
                  )
                : t("signMessage", "Sign release letter")}
            </span>
            {!noEncounters && (
              <div className={styles.signContainer}>
                <TextInput
                  id="userLogin"
                  labelText={t("login", "Login")}
                  onChange={(event) =>
                    setSignInfo((x) => ({ ...x, login: event.target.value }))
                  }
                  value={signInfo.login}
                />
                <TextInput
                  id="userPassword"
                  type="password"
                  labelText={t("password", "Password")}
                  onChange={(event) =>
                    setSignInfo((x) => ({ ...x, password: event.target.value }))
                  }
                  value={signInfo.password}
                />
                <Button kind="primary" onClick={() => signDischargeLetter()}>
                  {isSigned ? t("resign", "Re-Sign") : t("sign", "Sign")}
                </Button>
              </div>
            )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t("cancel", "Cancel")}
        </Button>
        <Button
          kind="primary"
          onClick={printReport}
          disabled={!isSigned || isLoading}
        >
          {t("printReport", "Print Release Letter")}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default PrintDischargeReportDialog;
