/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";





describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then should render a form", () => {
      // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // window.localStorage.setItem('user', JSON.stringify({
      //   type: 'Employee'
      // }));
      // const root = document.createElement("div")
      // root.setAttribute("id", "root")
      // document.body.append(root)
      // router();
      // window.onNavigate(ROUTES_PATH.NewBill)

      document.body.innerHTML = NewBillUI()

      //to-do write assertion
      // const root = document.createElement("div")
      // root.setAttribute("id", "root")
      // document.body.append(root)


      const newBillForm = screen.getByTestId('form-new-bill')

      // const location = document.location.hash

      // expect(location).toEqual('#employee/bill/new')

      expect(newBillForm).toBeTruthy()


    });

  });
  describe('When upload file input', () => {
    test('Then upload file', () => {
      // Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // window.localStorage.setItem('user', JSON.stringify({
      //   type: 'Employee'
      // }));
      // const root = document.createElement("div")
      // root.setAttribute("id", "root")
      // document.body.append(root)
      // router();
      // window.onNavigate(ROUTES_PATH.NewBill)
      document.body.innerHTML = NewBillUI()

      const file = new File(['proof'], 'proof.png', { type: 'image/png' });
      const input = screen.getByTestId('file')

      const handleChangeFile = jest.fn(() => {
        NewBill.handleChangeFile
      });
      // fireEvent.click(input, {
      //   target: {
      //     files: [file]
      //   }
      // })

      input.addEventListener('change', handleChangeFile())
      expect(handleChangeFile).toHaveBeenCalled()
      // expect(input.files[0]).toBe(file)
      // expect(input.files[0].type).toBe('image/png')



    })
  });
  describe('When user submit form', () => {
    test('Submit form', () => {
      document.body.innerHTML = NewBillUI()
      const form = screen.getByTestId("form-new-bill");
      const expenseType = screen.getByTestId("expense-type")
      fireEvent.change(expenseType, {
        target: { value: "Transports" }
      });

      const datepicker = screen.getByTestId("datepicker");
      fireEvent.change(datepicker, {
        target: { value: "29 Oct, 2020" }
      });
      const amount = screen.getByTestId("amount")
      // fireEvent.mouseDown(amount)
      fireEvent.change(amount, {
        target: { value: "100" }
      })
      const pct = screen.getByTestId("pct")
      fireEvent.change(pct, { target: { value: "30" } })
      const fileInput = screen.getByTestId("file")
      const file = new File(['proof'], 'proof.png', { type: 'image/png' });


      fireEvent.change(fileInput, { target: { files: file } })

      // const submitButton = screen.getByTestId("form-submit-button")

      // fireEvent.click(submitButton)

      const formSubmit = jest.fn(() => {
        NewBill.Submit
      });
      form.addEventListener('Submit', formSubmit());

      expect(formSubmit).toHaveBeenCalled()
      // expect(datepicker).toEqual('2017')
      expect(amount.value).toEqual('100');
      expect(expenseType.value).toEqual('Transports')
    })
  })

})
