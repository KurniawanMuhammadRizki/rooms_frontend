"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Check } from "lucide-react";
import Buttons from "@/components/Buttons";
import { useCreateTransaction } from "@/hooks/transactions/useCreateTransaction";
import { TransactionRequest } from "@/types/transactions/TransactionRequestType";
import { PaymentMethodType } from "@/types/transactions/PaymentMethodType";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingStateAnimation from "@/components/animations/LoadingStateAnimation";
import { useGetPropertyBySlug } from "@/hooks/properties/useGetPropertyBySlug";
import { useRoomBySlug } from "@/hooks/rooms/useRoomBySlug";
import { useRoomPrice } from "@/hooks/rooms/useRoomPrice";
import { useSession } from "next-auth/react";
import { useFindUserbyEmail } from "@/hooks/user/useFindUserbyEmail";
import { Suspense, useState } from "react";
import ErrorAnimation from "@/components/animations/ErrorAnimation";
import NotFound from "@/app/not-found";
import FormCheckoutCard from "./FormCheckoutCard";
import PaymentMethodCard from "./PaymentMethodCard";
import CancelationCard from "./CancelationCard";
import ImportantInformationCard from "./ImportantInformationCard";
import RoomDetailCard from "./RoomDetailCard";
import BookCta from "./BookCta";
import PriceDetailsCard from "./PriceDetailsCard";

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

const CheckoutComponent = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const createTransaction = useCreateTransaction();
  const formatDate = (date: string | Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const searchParams = useSearchParams();
  const propertySlug = searchParams.get("property");
  const roomSlug = searchParams.get("room");
  const fromSlug = searchParams.get("from");
  const toSlug = searchParams.get("to");
  const adultSlug = searchParams.get("adult");
  const childrenSlug = searchParams.get("children");
  console.log("ini property nya: ", propertySlug);
  console.log("ini room nya: ", roomSlug);
  console.log("ini from nya: ", fromSlug);
  console.log("ini to nya: ", toSlug);
  console.log("ini adult nya: ", adultSlug);
  console.log("ini children nya: ", childrenSlug);

  const fromDate = new Date(fromSlug || " ");
  const toDate = new Date(toSlug || " ");

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedFromDate = fromDate.toLocaleDateString("en-US", options);
  const formattedToDate = toDate.toLocaleDateString("en-US", options);
  const differenceInMilliseconds = toDate.getTime() - fromDate.getTime();

  const differenceInDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  const { data: properties, isLoading: propertyLoading } = useGetPropertyBySlug(
    propertySlug || ""
  );

  const { data: room, isLoading: roomLoading } = useRoomBySlug(roomSlug || "");

  // const { data: roomPrice } = useRoomPrice(
  //   room?.slug || " ",
  //   properties?.id || " ",
  //   fromDate
  // );

  const { data: session } = useSession();
  const { data: user, isLoading: userLoading } = useFindUserbyEmail(
    session?.user.email
  );
  const userId = user?.id;

  console.log("ini propertynya", properties);

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
      // <LoadingStateAnimation />;
      setIsLoading(true);
      const paymentMethod =
        values.paymentMethod === "manual"
          ? PaymentMethodType.MANUAL_TRANSFER
          : PaymentMethodType.BANK_TRANSFER;
      const transactionRequest: TransactionRequest = {
        usersId: userId || "",
        propertiesId: properties?.id || "",
        paymentMethod: paymentMethod,
        firstName: values.firstName,
        lastName: values.lastName,
        mobileNumber: values.mobileNumber,
        adult: parseInt(adultSlug || ""),
        children: parseInt(childrenSlug || ""),
        transactionDetailRequests: {
          roomId: room?.id || "",
          // startDate: formatDate("2024-09-26"),
          // endDate: formatDate("2024-09-27"),
          startDate: formatDate(fromSlug || ""),
          endDate: formatDate(toSlug || ""),
        },
      };
      createTransaction.mutate(transactionRequest, {
        onSuccess: (randomString) => {
          console.log("ini on success");
          //alert("Transaction created successfully!");
          setSubmitting(false);
          setIsLoading(false);
          router.push(`/checkout/${randomString}`);
        },
        onError: (error) => {
          console.log("ini errornya ", error);
          setPaymentError(true);
          //alert(`Error: ${error.message}`);
          setSubmitting(false);
          setIsLoading(false);
        },
      });
    },
  });

  if (propertyLoading) return <LoadingStateAnimation />;
  if (roomLoading) return <LoadingStateAnimation />;

  if (!room) return <NotFound />;
  if (!properties) return <NotFound />;
  if (!adultSlug) return <NotFound />;
  if (!childrenSlug) return <NotFound />;
  if (!fromSlug) return <NotFound />;
  if (!toSlug) return <NotFound />;

  console.log("ini checkin timenya ", properties.checkInTime);
  const checkInTime = properties.checkInTime;
  const formattedCheckInTime = checkInTime.slice(0, 5);
  const checkOutTime = properties.checkOutTime;
  const formattedCheckOutTime = checkOutTime.slice(0, 5);

  return (
    <Suspense fallback={<LoadingStateAnimation />}>
      <div className="min-h-screen py-8 px-5 sm:px-10 md:px-20 lg:px-[80px]">
        {isLoading ? (
          <>
            <LoadingStateAnimation />
          </>
        ) : paymentError ? (
          <>
            <ErrorAnimation />
          </>
        ) : (
          <>
            <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl py-3">
              Secure booking — only takes 2 minutes!
            </h1>
            <div className="flex items-center text-green-700 py-3">
              <Check className="w-5 h-5 mr-2" />
              <span>
                You&apos;ve picked a winner! This hotel is rated{" "}
                {properties.averageRating}/10.
              </span>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="md:w-7/12 lg:w-8/12 w-full">
                  <FormCheckoutCard
                    formik={formik}
                    adult={parseInt(adultSlug)}
                    childrenNumber={parseInt(childrenSlug)}
                    bedType={room.bedTypes.name}
                    includeBreakfast={room.includeBreakfast}
                  />
                  <PaymentMethodCard formik={formik} />
                  <CancelationCard />
                  <ImportantInformationCard
                    fromDate={formattedFromDate}
                    toDate={formattedToDate}
                    night={differenceInDays}
                    checkIn={formattedCheckInTime}
                    checkout={formattedCheckOutTime}
                  />
                </div>
                <div className="md:w-5/12 lg:w-4/12 w-full space-y-4">
                  <RoomDetailCard
                    roomName={room.name}
                    night={differenceInDays}
                    propertyName={properties.name}
                    rating={properties.averageRating}
                    review={properties.totalReview}
                    from={formattedFromDate}
                    to={formattedToDate}
                    images={properties.propertyPictures}
                  />
                  <BookCta />
                  <div className="sticky top-4">
                    <PriceDetailsCard
                      night={differenceInDays}
                      price={room.price || 0}
                    />
                    <Buttons
                      value={"Book now"}
                      type={"submit"}
                      className={"w-full my-5 rounded-lg"}
                    />
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </Suspense>
  );
};
export default CheckoutComponent;
