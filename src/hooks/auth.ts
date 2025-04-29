import { UserUpdate } from "@/api/models";
import { useUpdateUserInfo } from "@/api/endpoints/users/users.gen";
import { useLogin as useLoginMutation } from "@/api/endpoints/authentication/authentication.gen";

export const useUpdateUserProfile = () => {
  const mutation = useUpdateUserInfo();

  const handleSubmit = async (payload: UserUpdate) => {
    await mutation.mutateAsync({ userId: "me", data: payload });
  };

  return {
    handleSubmit,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    wasExecuted: !mutation.isIdle,
    isError: mutation.isError,
    error: mutation.error,
    resetMutation: mutation.reset,
  };
};

export const useLogin = () => {
  const mutation = useLoginMutation();

  const handleSubmit = async (payload: { data: BodyLoginApiTokenPost }) => {
    await mutation.mutateAsync(payload);
  };

  return {
    handleSubmit,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
