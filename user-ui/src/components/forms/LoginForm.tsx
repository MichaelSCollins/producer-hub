import loginAction from "@/actions/login"
import AppForm from "./AppForm"

function LoginForm() {
    return <AppForm
        inputs={[{
            name: "username",
            type: "text",
            label: "Username"
        }, {
            name: "password",
            type: "password",
            label: "Password"
        }]} action={loginAction} />
}
export default LoginForm