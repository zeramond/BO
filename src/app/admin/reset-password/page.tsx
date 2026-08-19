import ResetPasswordForm from "./ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
    error?: string | string[];
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token =
    typeof params.token === "string" ? params.token : null;
  const invalidLink = Boolean(params.error) || !token;

  return (
    <ResetPasswordForm
      token={token}
      invalidLink={invalidLink}
    />
  );
}
