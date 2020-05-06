import React, { useCallback, useRef } from 'react'
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'

import getValidadtionsErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png'

import {
  Container,
  Title,
  ForgotPassowrd,
  ForgotPassowrdText,
  CreateAccountButton,
  CreateAccountButtonText
} from "./styles";

interface SingInFormData {
  email: string,
  password: string
}


const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const navigation = useNavigation()

  const handleSignIn = useCallback(
    async (data: SingInFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatorio.')
            .email('Digite um e-mail valido.'),
          password: Yup.string().required('Senha obrigatória.')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        // await signIn({
        //   email: data.email,
        //   password: data.password
        // })

         // history.push('/dashboard')

      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidadtionsErrors(err)

          formRef.current?.setErrors(errors)

          return
        }
        // reacti18n para fazer internacionalização...
        Alert.alert(
          "Erro na autenticação.",
          'Ocorreu um erro ao fazer login, cheque as credenciais.'
        )
      }
    }, [])


  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container >
            <Image source={logoImg} />
            <View>
              <Title>Faça seu Logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm()
                }}>
                Entrar
              </Button>
            </Form>

            <ForgotPassowrd onPress={() => { }}>
              <ForgotPassowrdText>Esqueci minha senha</ForgotPassowrdText>
            </ForgotPassowrd>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <CreateAccountButtonText>
          <Icon name="log-in" size={20} color="#ff9000" />  Criar uma conta.
        </CreateAccountButtonText>
      </CreateAccountButton>

    </>
  )
}

export default SignIn
