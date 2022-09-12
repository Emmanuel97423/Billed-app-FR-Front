/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES_PATH } from "../constants/routes.js";
import router from "../app/Router.js";
import store from "../__mocks__/store"



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then should render a form", () => {

      document.body.innerHTML = NewBillUI()

      //to-do write assertion

      const newBillForm = screen.getByTestId('form-new-bill')

      expect(newBillForm).toBeTruthy()

    });

  });
  describe('When user submit form', () => {
    test('Then should change or submit new bill form', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router();
      window.onNavigate(ROUTES_PATH.Bills)
      const newBill = new NewBill({ document, onNavigate, store: store, localStorage: window.localStorage })
      const form = screen.getByTestId("form-new-bill");
      const expenseType = screen.getByTestId("expense-type")
      fireEvent.change(expenseType, {
        target: { value: "Transports" }
      });

      const datepicker = screen.getByTestId("datepicker");

      fireEvent.input(datepicker, { target: { value: "2022-01-01" } })

      const amount = screen.getByTestId("amount")
      fireEvent.input(amount, {
        target: { value: "100" }
      })
      const pct = screen.getByTestId("pct")
      fireEvent.input(pct, { target: { value: "30" } })
      const fileInput = screen.getByTestId("file")
      const file = new File(['proof'], 'proof.png', { type: 'image/png' });


      const handleChangeFile = jest.fn((e) => {
        newBill.handleChangeFile(e)
      });
      const handleSubmit = jest.fn((e) => {
        newBill.handleSubmit(e);
      })



      fileInput.addEventListener('change', handleChangeFile)
      fireEvent.click(fileInput)
      userEvent.upload(fileInput, file)
      //TEst handleSubmit
      const formNewBill = screen.getByTestId("form-new-bill")
      formNewBill.addEventListener('submit', handleSubmit)

      const submitButton = screen.getByTestId('form-submit-button')
      fireEvent.click(submitButton)

      expect(fileInput.files[0]).toStrictEqual(file)
      expect(fileInput.files.item(0)).toStrictEqual(file)
      expect(fileInput.files).toHaveLength(1)
      expect(datepicker.value).toEqual('2022-01-01')
      expect(amount.value).toEqual('100');
      expect(pct.value).toEqual('30');
      expect(expenseType.value).toEqual('Transports')

    });



  })

});

//test d'intégration POST bill

describe("Given I m connected as an employee", () => {
  describe("When I navigate to newbill", () => {
    afterEach(() => {
      // restaure l'espion créé avec spyOn
      jest.restoreAllMocks();
    });

    test("Then create bill to mock API POST", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      const spy = jest.spyOn(store, "bills");
      const isNewBill = store.bills()
      const url = 'https://localhost:3456/images/test.jpg'
      isNewBill.create().then(result => {
        expect(result.fileUrl).toEqual(url)

      })
      expect(spy).toHaveBeenCalled()


    });
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        console.error = jest.fn();
        console.error()
        jest.spyOn(store, "bills")
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
        store.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(console.error("Error 404"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.NewBill)
        await new Promise(process.nextTick);
        expect(console.error).toHaveBeenCalled()
      });
      test("fetches bills from an API and fails with 500 message error", async () => {
        store.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(console.error("Error 500"))
            }
          }
        })
        window.onNavigate(ROUTES_PATH.NewBill)
        await new Promise(process.nextTick);
        expect(console.error).toHaveBeenCalled()
      })

    })
  })
})
