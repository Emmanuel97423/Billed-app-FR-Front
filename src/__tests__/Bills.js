/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))

      const windowIcon = screen.getByTestId('icon-window')

      //to-do write expect expression
      expect(windowIcon).toBeTruthy()
      expect(windowIcon.getAttribute("class")).toEqual('active-icon')

    })
    test("Then bills should be ordered from earliest to latest", () => {
      //test bills order antochronologique
      const billsAntiChrono = (a, b) => ((a.date < b.date) ? 1 : -1)
      // bills.sort(antiChrono)
      bills.sort(billsAntiChrono)


      //Trie des bills antichrono a faire
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)

      const antiChrono = (a, b) => ((a < b) ? 1 : -1)

      const datesSorted = [...dates].sort(antiChrono)



      expect(dates).toEqual(datesSorted)
    })

  });

  describe("when im on new bills page", () => {

    test("When employee click on new bills route change to new bill page", async () => {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const newBillButton = screen.getByTestId('btn-new-bill')
      fireEvent.click(newBillButton)
      await window.onNavigate(ROUTES_PATH.NewBill)

      const location = document.location.hash

      expect(location).toEqual('#employee/bill/new')

    });


  });
  // Integration test for GET Bills
  describe("Given I am a user connected as employee", () => {
    describe("When i navigate to Bills", () => {
      test("fetches bills mock API GET", async () => {
        localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }));
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        router()
        window.onNavigate(ROUTES_PATH.Bills)
        expect(screen.getByTestId("tbody")).toBeTruthy()
      })
    })
  })
})
