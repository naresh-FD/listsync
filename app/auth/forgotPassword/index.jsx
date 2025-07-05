import {
  View,
  Text,
  ImageBackground,
  Pressable,
  TextInput,
  Image,
  ToastAndroid,
} from "react-native";
import { forgotPasswordStyles as styles } from "./forgotPasswordStyles";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { goToRoute } from "../../util/helper";

import {
  screenBgImage,
  supportEmail,
  circleTickImage,
} from "../../util/constants";
import { useMemo, useState, useRef } from "react";

import InputField from "../../../reusables/InputField";
import Button from "../../../reusables/Button/Button";

const ForgotPassword = () => {
  const router = useRouter();
  const [stage, setStage] = useState(1);

  //Stage 1
  const [emailAddress, setEmailAddress] = useState("");

  const stage1OnSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = (email) => emailRegex.test(email);
    // if (emailAddress && isValidEmail(emailAddress)) {
    //   setStage(2);
    // } else {
    //   ToastAndroid.show("Enter valid Email adddress", ToastAndroid.SHORT);
    // }
    setStage(2);
  };

  //Stage 2
  const length = 4;
  const [otp, setOtp] = useState(Array(length).fill("1234"));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const stage2OnSubmit = () => {
    const joined = otp.join("");
    // if (joined.length === length && !otp.includes("")) {
    //   console.log("OTP Complete:", joined);
    //   if (onComplete) onComplete(joined);
    //   setStage(3);
    // }
    setStage(3);
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  //Stage 3
  const [stage3Fields, setStage3Fields] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const stage3OnSubmit = () => {
    setStage(4);
  };

  //Stage 4
  const stage4OnSubmit = () => {
    goToRoute(route, "replace", "/auth/login");
  };

  const RenderResetStage = useMemo(() => {
    switch (stage) {
      case 1:
        return (
          <View style={styles.stage1}>
            <Text style={styles.subTitle}>
              Reset your password with email verfication
            </Text>
            <InputField
              type="text"
              name="email"
              label="Email"
              placeholder="Enter your email address"
              value={emailAddress}
              onchange={setEmailAddress}
              style={{ marginTop: 10 }}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stage1}>
            <Text style={styles.subTitle}>
              we sent a code to{" "}
              <Text style={styles.subTitleHighlight}>{emailAddress}</Text>
            </Text>
            <View style={styles.resetCodeContainer}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  style={styles.inputBox}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={value}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  textAlign="center"
                />
              ))}
            </View>
            <Text style={styles.subTitle}>
              Didn't receive an email?{" "}
              <Text style={styles.subTitleHighlight}>resend</Text>
            </Text>
          </View>
        );
      case 3:
        return (
          <View style={styles.stage1}>
            <Text style={styles.subTitle}>Create new Password</Text>
            <InputField
              type="text"
              name="password"
              label="New Password"
              placeholder="Enter New Password"
              value={stage3Fields.newPassword}
              onchange={(value) =>
                setStage3Fields((stage3Fields) => ({
                  ...stage3Fields,
                  newPassword: value,
                }))
              }
              style={{ marginTop: 10 }}
            />
            <InputField
              type="text"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm New Password"
              value={stage3Fields.confirmPassword}
              onchange={(value) =>
                setStage3Fields((stage3Fields) => ({
                  ...stage3Fields,
                  confirmPassword: value,
                }))
              }
              style={{ marginTop: 10 }}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stage1}>
            <Text style={styles.subTitle}>Your password has been reset</Text>
            <View style={styles.imageContainer}>
              <Image source={circleTickImage} style={styles.circleImage} />
            </View>
          </View>
        );
    }
  }, [stage]);

  const RenderStageBar = useMemo(() => {
    return (
      <View style={styles.stageBar}>
        {[1, 2, 3, 4].map((itemStages, index) => {
          return (
            <View
              key={index}
              style={[
                styles.stage,
                itemStages <= stage
                  ? styles.stageSelected
                  : styles.stageUnSelected,
              ]}
            >
              <Text style={styles.stageText}>{itemStages}</Text>
            </View>
          );
        })}
      </View>
    );
  }, [stage]);

  const RenderResetPasswordButton = useMemo(() => {
    switch (stage) {
      case 1:
        return (
          <Button label="Continue" onPress={stage1OnSubmit} theme="dark" />
        );
      case 2:
        return (
          <Button label="Continue" onPress={stage2OnSubmit} theme="dark" />
        );
      case 3:
        return <Button label="Submit" onPress={stage3OnSubmit} theme="dark" />;
      case 4:
        return (
          <Button label="Back to Login" onPress={stage4OnSubmit} theme="dark" />
        );
    }
  }, [stage]);

  return (
    <ImageBackground
      source={screenBgImage}
      style={styles.forgotPasswordWrapper}
    >
      <View style={styles.forgotPasswordContainer}>
        <View style={styles.navigationContainer}>
          <Pressable
            onPress={() => router.back()}
            style={styles.navigationContainerImageTextWrapper}
          >
            <Ionicons name="arrow-back" size={34} color="white" />
            <Text style={styles.navigationText}>Login</Text>
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Forgot Password</Text>
          {RenderResetStage}
          {RenderStageBar}
        </View>
        <View style={styles.footerContainer}>{RenderResetPasswordButton}</View>
      </View>
    </ImageBackground>
  );
};

export default ForgotPassword;
