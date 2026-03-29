import Apis, { authApis, endpoints } from "../api/Apis";
import { config } from "../config/config";
import { toast } from "react-toastify";
import { useState } from "react";
import { useCookies } from "react-cookie";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [, setCookie, removeCookie] = useCookies(["access_token", "user_info"]);

    const buildCookieOptions = () => ({
        path: "/",
        sameSite: "strict",
        secure: typeof window !== "undefined" && window.location.protocol === "https:",
    });

    const register = async (form) => {
        try {
            setLoading(true);
            if (form.password !== form.confirmpassword) {
                toast.error("Mật khẩu không khớp! Vui lòng nhập lại");
                return false;
            }
            const formData = new FormData();

            formData.append("username", form.username);
            formData.append("password", form.password);
            if (form.first_name) formData.append("first_name", form.first_name);
            if (form.last_name) formData.append("last_name", form.last_name);
            if (form.email) formData.append("email", form.email);
            if (form.role) formData.append("role", form.role);
            if (form.dob) formData.append("dob", form.dob);
            if (form.avatar) formData.append("avatar", form.avatar);

            await Apis.post(endpoints["register"], formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Đăng ký thành công");
            return true;

        } catch (error) {
            console.error(error.response?.data);
            toast.error("Đăng ký thất bại!");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (form) => {
        try {
            setLoading(true);

            const formData = new URLSearchParams();
            formData.append("username", form.username);
            formData.append("password", form.password);
            formData.append("grant_type", "password");
            formData.append("client_id", config.clientId);
            formData.append("client_secret", config.clientSecret);

            const res = await Apis.post(endpoints["login"], formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            const accessToken = res.data.access_token;
            setCookie("access_token", accessToken, buildCookieOptions());

            const userInfoRes = await authApis(accessToken).get(endpoints["current-user"]);
            setCookie("user_info", JSON.stringify(userInfoRes.data), buildCookieOptions());

            toast.success("Đăng nhập thành công!");
            return true;

        } catch (error) {
            console.error(error);
            toast.error("Sai tài khoản hoặc mật khẩu!");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        removeCookie("access_token", { path: "/" });
        removeCookie("user_info", { path: "/" });
        setMessage("Đã đăng xuất");
    };

    return { register, login, logout, loading, message };
};