//register user Interface
export interface ISignUp {
    name: string;
    email: string;
    password: string;
    mobile:string;
    accountType?: "Admin" | "User";
};

//activation interface
export interface IActivationRequest {
    activation_token: string;
    activation_code: string;
};

//login user interface
export interface ILogin {
    email: string;
    password: string
};

//social login interface
export interface ISocialLogin {
    email: string;
    name: string;
    image: string;
};

//update password
export interface IUpdatePassword {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};