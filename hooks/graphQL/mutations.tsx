import { gql } from "graphql-request";

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: TransactionRequest!) {
    createTransaction(input: $input)
  }
`;


export const ACCEPT_PAYMENT_PROOF = gql`
  mutation AcceptPaymentProof($transactionId: ID!) {
    acceptPaymentProof(transactionId: $transactionId)
  }
`;

export const REJECT_PAYMENT_PROOF = gql`
  mutation RejectPaymentProof($transactionId: ID!) {
    rejectPaymentProof(transactionId: $transactionId)
  }
`;

export const CREATE_VIRTUAL_ACCOUNT_CODE = gql`
  mutation CreateVirtualAccountCode($bookingCode: String!, $bank: String!) {
    createVirtualAccountCode(bookingCode: $bookingCode, bank: $bank) {
      status_code
      status_message
      transaction_id
      order_id
      merchant_id
      gross_amount
      currency
      payment_type
      transaction_time
      transaction_status
      fraud_status
      expiry_time
      va_numbers {
        bank
        va_number
      }
    }
  }

export const REGISTER_USER = gql`
  mutation UserRegister($input: RegisterInput!) {
    userRegister(input: $input)
  }
`;

export const REGISTER_TENANT = gql`
  mutation TenantRegister($input: RegisterInput!) {
    tenantRegister(input: $input)
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($email: String!) {
    verifyEmail(email: $email) {
        id
        email
        username
        role
        mobileNumber
    }
}
`;