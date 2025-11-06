import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler, Resolver } from "react-hook-form"
import { ZodError } from "zod";
import { registerSchema , type RegisterInput} from "../zodSchema/register";


const RegisterPage = () => {
// Custom resolver using Zod.safeParse so validation never throws an uncaught ZodError.
const zodSafeResolver: Resolver<RegisterInput> = async (values) => {
  const result = registerSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  // ZodError exposes issues (array of ZodIssue) in v4+; use issues instead of errors.
  const issues = (result.error as ZodError)?.issues ?? [];

  const errors = (issues)
    .reduce((acc, issue) => {
      const key = issue.path && issue.path.length ? String(issue.path[0]) : undefined;
      if (!key) return acc;
      acc[key] = {
        type: String(issue.code ?? 'validation'),
        message: String(issue.message ?? 'Invalid'),
      };
      return acc;
    }, {} as Record<string, { type: string; message: string }>);

  return { values: {}, errors };
};

const { 
  register, 
  handleSubmit, 
  formState: { errors }
} = useForm<RegisterInput>({
  resolver: zodSafeResolver,
  mode: "onTouched",
  criteriaMode: "all",
  reValidateMode: "onChange"
});
const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
  try {
    console.log("Form submitted successfully:", data);
    // Add your API call here
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error submitting form:", error);
    }
  }
};
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-4" 
        noValidate
      >
        <Input 
          label="Username" 
          {...register('username')} 
          type="text"
          error={errors.username?.message} 
        />
        <Input 
          label="Email" 
          {...register('email')} 
          type="email"
          error={errors.email?.message}
        />
        <Input 
          label="Password" 
          {...register('password')} 
          type="password"
          error={errors.password?.message}
        />
        <Button fullWidth >
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
