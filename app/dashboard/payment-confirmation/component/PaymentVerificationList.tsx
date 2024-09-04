"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaymentProofType } from "@/types/payment-proof/PaymentProofType";
import usePendingPaymentProof from "@/hooks/payment-proof/usePendingPaymentProof";
import { useAcceptPaymentProof } from "@/hooks/payment-proof/useAcceptPaymentProof";
import { useRejectPaymentProof } from "@/hooks/payment-proof/useRejectPaymentProof";
import usePendingPaymentProofByPropertyId from "@/hooks/payment-proof/usePendingPaymentProofByPropertyId";

const PaymentVerificationList = () => {
  const [selectedProof, setSelectedProof] = useState<PaymentProofType | null>(
    null
  );
  //const { data: paymentProofs, isLoading } = usePendingPaymentProof();
  const { data: paymentProofs, isLoading } =
    usePendingPaymentProofByPropertyId();
  const { mutate: acceptPaymentProof } = useAcceptPaymentProof();
  const { mutate: rejectPaymentProof } = useRejectPaymentProof();

  const handleApprove = (id: string) => {
    acceptPaymentProof({ transactionId: id });
  };

  const handleReject = (id: string) => {
    rejectPaymentProof({ transactionId: id });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="space-y-4">
      {paymentProofs?.map((proof) => (
        <Card key={proof.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="flex-1 p-4 sm:p-6 space-y-1 sm:space-y-2 w-full sm:w-auto">
                <div className="flex items-center space-x-4">
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <Image
                      src="/path-to-your-icon.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{proof.id}</h3>
                    <div className="sm:hidden flex justify-between text-sm text-gray-500 mt-1 w-full">
                      <span className="text-left mr-2">
                        {proof.transaction.finalPrice.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </span>
                      <span className="text-right">
                        {/* {new Date(proof.transaction.).toLocaleDateString()} */}
                        transaction date
                      </span>
                    </div>

                    <p className="hidden sm:block text-sm text-gray-500">
                      {proof.transaction.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block flex-1 p-6">
                <p className="text-gray-600">
                  {proof.transaction.finalPrice.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </p>
              </div>
              <div className="hidden sm:block flex-1 p-6">
                <p className="text-gray-600">
                  {/* {new Date(proof.date).toLocaleDateString()} */}
                  transaction date
                </p>
              </div>
              <div className="p-4 sm:p-6 w-full sm:w-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setSelectedProof(proof)}>
                      View Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="px-5 sm:px-10 md:px-20">
                    <DialogHeader>
                      <DialogTitle>Payment Proof</DialogTitle>
                    </DialogHeader>
                    {selectedProof && (
                      <>
                        <div className="mt-2 text-center font-semibold">
                          Transaction Amount:{" "}
                          {selectedProof.transaction.finalPrice.toLocaleString(
                            "id-ID",
                            {
                              style: "currency",
                              currency: "IDR",
                            }
                          )}
                        </div>
                        <div className="mt-4 px-[5px] sm:px-0">
                          {" "}
                          {/* Added padding for mobile */}
                          <Image
                            src={selectedProof.imgUrl}
                            alt="Payment Proof"
                            width={500}
                            height={300}
                            layout="responsive"
                          />
                        </div>
                        <div className="mt-4 flex justify-between">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="flex-1 mr-2 bg-green-500 hover:bg-green-600">
                                <Check className="mr-2 h-4 w-4" /> Approve
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirm Approval
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to approve this
                                  transaction?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleApprove(selectedProof.transaction.id)
                                  }>
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="flex-1 ml-2 bg-red-500 hover:bg-red-600">
                                <X className="mr-2 h-4 w-4" /> Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirm Rejection
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reject this
                                  transaction?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleReject(selectedProof.transaction.id)
                                  }>
                                  Reject
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PaymentVerificationList;