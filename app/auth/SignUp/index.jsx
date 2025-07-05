import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import Button from "../../../reusables/Button/Button";
import InputField from "../../../reusables/InputField/";

import { SignUpStyles as styles } from "./signUpStyles";
import { useState } from "react";
import CheckBox from "../../../reusables/Checkbox/Checkbox";
import { useRouter } from "expo-router";
import { validateForm } from "../../util/helper";
import { Ionicons } from "@expo/vector-icons";

const SignUp = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isTermsAndConditionsSelected, setIsTermsAndConditionsSelected] =
    useState(false);

  const goToRoute = (route) => {
    router.push(route);
  };

  const signUpHandler = () => {
    const form = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      acceptedTerms: isTermsAndConditionsSelected,
    };

    const errors = validateForm(form);

    if (Object.keys(errors).length === 0) {
      console.log("Form is valid. Submit it!");
      console.log({ firstName, lastName, email, password });
    } else {
      console.log("Form errors:", errors);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/screenBg.png")}
      style={styles.signUpWrapper}
    >
      <View style={styles.signUpContainer}>
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={() => goToRoute("/auth/WelcomeScreen")}
            style={styles.navigationContainerImageTextWrapper}
          >
            <Ionicons name="arrow-back" size={34} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.formsContainer}>
          <Text style={styles.signUpTitle}>Sign up</Text>
          <Text style={styles.signUpHeading}>Welcome</Text>
          <Text style={styles.signUpSubHeading}>
            Hello there, sign up to continue!
          </Text>
          <View style={styles.formFieldsContainer}>
            <InputField
              name="firstName"
              type="text"
              placeholder="Jon"
              label="First Name"
              value={firstName}
              onchange={setFirstName}
            />
            <InputField
              name="lastName"
              type="text"
              placeholder="Deo"
              label="Last Name"
              value={lastName}
              onchange={setLastName}
            />
            <InputField
              name="email"
              type="text"
              label="Email"
              placeholder="jondeo@gmail.com"
              value={email}
              onchange={setEmail}
            />
            <InputField
              name="password"
              type="text"
              label="Password"
              placeholder="*****"
              value={password}
              onchange={setPassword}
            />
          </View>
          <CheckBox
            label="By creating an account, you agree to our Terms and Conditions"
            value={isTermsAndConditionsSelected}
            setValue={setIsTermsAndConditionsSelected}
          />
          <Button label="Sign up" theme="dark" onPress={signUpHandler} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignUp;
