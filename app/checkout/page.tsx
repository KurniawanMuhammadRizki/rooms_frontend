"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Buttons from "@/components/Buttons";
import BookCta from "./component/BookCta";
import FormCheckoutCard from "./component/FormCheckoutCard";
import PaymentMethodCard from "./component/PaymentMethodCard";
import CancelationCard from "./component/CancelationCard";
import ImportantInformationCard from "./component/ImportantInformationCard";
import RoomDetailCard from "./component/RoomDetailCard";
import PriceDetailsCard from "./component/PriceDetailsCard";
import { useCreateTransaction } from "@/hooks/transactions/useCreateTransaction";
import { TransactionRequest } from "@/types/transactions/TransactionRequestType";
import { PaymentMethodType } from "@/types/transactions/PaymentMethodType";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  mobileNumber: Yup.string()
    .matches(/^\+\d{2,3}\s\d{3,}(-\d{3,4}){1,}$/, "Invalid phone number format")
    .required("Phone number is required"),
  paymentMethod: Yup.string()
    .oneOf(["manual", "bank"], "Please select a valid payment method")
    .required("Payment method is required"),
});

const Page = () => {
  const router = useRouter();
  const createTransaction = useCreateTransaction();
  const formatDate = (date: string | Date) => {
    return new Date(date).toISOString().split("T")[0];
  };
  const formik = useFormik({
    initialValues: {
      travelerName: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      paymentMethod: "manual",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const paymentMethod =
        values.paymentMethod === "manual"
          ? PaymentMethodType.MANUAL_TRANSFER
          : PaymentMethodType.BANK_TRANSFER;
      const transactionRequest: TransactionRequest = {
        usersId: "1",
        propertiesId: "1",
        paymentMethod: paymentMethod,
        firstName: values.firstName,
        lastName: values.lastName,
        mobileNumber: values.mobileNumber,
        transactionDetailRequests: {
          roomId: "1",
          startDate: formatDate("2024-09-10"),
          endDate: formatDate("2024-09-11"),
        },
      };
      createTransaction.mutate(transactionRequest, {
        onSuccess: (randomString) => {
          //alert("Transaction created successfully!");
          setSubmitting(false);
          router.push(`/checkout/${randomString}`);
        },
        onError: (error) => {
          alert(`Error: ${error.message}`);
          setSubmitting(false);
        },
      });
    },
  });

  return (
    <div className="min-h-screen px-5 sm:px-10 md:px-20 lg:px-[130px]">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl py-3">
        Secure booking — only takes 2 minutes!
      </h1>
      <div className="flex items-center text-green-700 py-3">
        <Check className="w-5 h-5 mr-2" />
        <span>You've picked a winner! This hotel is rated 8.8/10.</span>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="md:w-7/12 lg:w-8/12 w-full">
            <FormCheckoutCard formik={formik} />
            <PaymentMethodCard formik={formik} />
            <CancelationCard />
            <ImportantInformationCard />
          </div>
          <div className="md:w-5/12 lg:w-4/12 w-full space-y-4 ">
            <RoomDetailCard />
            <BookCta />
            <PriceDetailsCard />
            <Buttons
              value={"Book now"}
              type={"submit"}
              className={"w-full my-5"}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
export default Page;