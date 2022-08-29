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

      // document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({ document, onNavigate, store: store, localStorage: window.localStorage })
      const form = screen.getByTestId("form-new-bill");
      const expenseType = screen.getByTestId("expense-type")
      fireEvent.change(expenseType, {
        target: { value: "Transports" }
      });

      const datepicker = screen.getByTestId("datepicker");

      fireEvent.input(datepicker, { target: { value: "2022-01-01" } })

      const amount = screen.getByTestId("amount")
      // fireEvent.mouseDown(amount)
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
        // updateBill(bill)
      })
      const email = window.localStorage.getItem('user')
      const bill = {
        email,
        type: screen.getByTestId("expense-type").value,
        name: screen.getByTestId("expense-name").value,
        amount: parseInt(screen.getByTestId("amount").value),
        date: screen.getByTestId("datepicker").value,
        vat: screen.getByTestId("vat").value,
        pct: parseInt(screen.getByTestId("pct").value),
        commentary: screen.getByTestId("commentary").value,
        fileUrl: null,
        fileName: null,
        status: 'pending'


      }

      const updateBill = jest.fn((bill) => {
        newBill.updateBill(bill)
      });


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

      // expect(handleSubmit).toHaveBeenCalled();
    });



  })

});

//test d'intégration POST bill

describe("Given I m connected as an employee", () => {
  describe("When I submit a newbill", () => {
    afterEach(() => {
      // restaure l'espion créé avec spyOn
      jest.restoreAllMocks();
    });
    // beforeEach(() => {
    //   jest.spyOn(store, "bills")

    //   Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    //   window.localStorage.setItem('user', JSON.stringify({
    //     type: 'Employee'
    //   }));
    //   const root = document.createElement("div")
    //   root.setAttribute("id", "root")
    //   document.body.append(root)
    //   router();
    // })
    test("Then create bill to mock API POST", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router();
      jest.spyOn(store, "bills")
      console.log("🚀 ~ file: NewBill.js ~ line 176 ~ test ~ spy", store.bills)
      return

      expect(spy).toHaveBeenCalled()
      store.bills.mockImplementationOnce()
      console.log('store.bills', store.bills.bills.create)
      // store.bills.create
      // console.log('store.bills.create():', store.bills.create)

      // store.bills.mockImplementationOnce(() => {
      //   return {
      //     update: () => {
      //       return Promise.resolve()
      //     }
      //   }
      // });

      // window.onNavigate(ROUTES_PATH.NewBill);

      //   const formNewBill = screen.getByTestId("form-new-bill")
      // const newBill = new NewBill({ document, onNavigate, store: store, localStorage: window.localStorage })
      // // const email = window.localStorage.getItem('user')
      // const file = screen.getByTestId('file');
      // // await new Promise(process.nextTick);

      // const handleSubmit = jest.fn((e) => {
      //   newBill.handleSubmit(e);
      // });
      // const handleChangeFile = jest.fn((e) => {
      //   file.handleChangeFile(e)
      // });
      // formNewBill.addEventListener('submit', handleSubmit);
      // file.addEventListener('change', handleChangeFile);

      // fireEvent.submit(formNewBill)

      // const BillName = await screen.getByText("encore")
      // expect(BillName).toBeTruthy()


      // window.onNavigate(ROUTES_PATH.NewBill)

      // const formNewBill = screen.getByTestId("form-new-bill")
      // const newBill = new NewBill({ document, onNavigate, store: store, localStorage: window.localStorage })
      // const email = window.localStorage.getItem('user')
      // const file = new File(['proof'], 'proof.png', { type: 'image/png' });

      // const bill = {
      //   email:"employee@test.tld",
      //   type: "transport",
      //   name: "Vol pour Maurice",
      //   amount: 500,
      //   date: "2022-01-01",
      //   vat: 70,
      //   pct: 20,
      //   commentary: "Hello my commentary",
      //   fileUrl: "http://localhost:8080/proof.png",
      //   fileName: "Vol Maurice justification",
      //   status: 'pending'
      // }
      // const handleSubmit = jest.fn((e) => {
      //   newBill.handleSubmit(e);
      // });


    })
  })
})
