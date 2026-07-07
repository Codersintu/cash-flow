const salaryForm = document.getElementById("salaryForm");
const salaryInput = document.getElementById("salary");
const totalSalary = document.getElementById("totalSalary");

const expansesForm=document.getElementById("expenseForm");
const expenseName=document.getElementById("expenseName")
const expenseAmount=document.getElementById("expenseAmount")
const totalExpenses=document.getElementById("totalExpanses")

const totalRemaining=document.getElementById("remainBalance");
//  salaryform 
salaryForm.addEventListener("submit",function(event){
    event.preventDefault();

    const salary=Number(salaryInput.value);

    if(salary <=0){
        alert("please enter a valid salary.")
        return;
    }
    localStorage.setItem("salary", salary);

    totalSalary.textContent = `₹${salary.toLocaleString("en-IN")}`;

    const total=Number(localStorage.getItem("totalExpenses"));
    const remainingBalance = salary - total;

    totalRemaining.textContent =
        `₹${remainingBalance.toLocaleString("en-IN")}`;
    
    localStorage.setItem("remainingBalance",remainingBalance)

    updateChart();

})

const savedSalary = Number(localStorage.getItem("salary"));

if (savedSalary) {
    totalSalary.textContent = `₹${savedSalary.toLocaleString("en-IN")}`;
}

//  expensesform
let expenses =
JSON.parse(localStorage.getItem("expenses")) || [];
expansesForm.addEventListener("submit",function(event){
    event.preventDefault();

    const name = expenseName.value.trim();

    const amount = Number(expenseAmount.value);
    const remainingbalance =Number(localStorage.getItem("remainingBalance"))
    
    if (name === "" || amount <= 0) {
        alert("Please enter valid expense details.");
        return;
    }

    if(amount > remainingbalance) alert("expanses amount is bigger then remaining amount.")


  if(amount <= remainingbalance){
    const expense = {
        name: name,
        amount: amount
    };

    expenses.push(expense);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    calculateTotal();

    // Calculate remaining
    const remainingBalance =
        remainingbalance - amount;
    
        console.log("remainingBalance",remainingBalance)
    totalRemaining.textContent =
        `₹${remainingBalance.toLocaleString("en-IN")}`;

    localStorage.setItem("remainingBalance",remainingBalance)
    renderExpenses();
    updateChart();


    expenseForm.reset();
}
})

const total=Number(localStorage.getItem("totalExpenses"));
if(total){
    totalExpenses.textContent=`₹${total.toLocaleString("en-IN")}`
}


function calculateTotal() {
    let total = 0;
   console.log("totla1",total)
    expenses.forEach((expense) => {
        total += expense.amount;
        console.log("total2",total);
    });

    totalExpenses.textContent =
        `₹${total.toLocaleString("en-IN")}`;


    localStorage.setItem("totalExpenses",total);

    // const savedSalary =
    //     Number(localStorage.getItem("salary")) || 0;

    
}

const remainingBalance =Number(localStorage.getItem("remainingBalance"))

totalRemaining.textContent =
        `₹${remainingBalance.toLocaleString("en-IN")}`;



function renderExpenses() {

    const expenseList = document.getElementById("expenseList");

    expenseList.innerHTML = "";

    expenses.forEach((expense, index) => {

        expenseList.innerHTML += `
            <div class="flex justify-between items-center  border rounded-lg p-2">

                    <h3 class="font-semibold">${expense.name}</h3>
                    <p>₹${expense.amount.toLocaleString("en-IN")}</p>


                <button
                    onclick="deleteExpense(${index})"
                    class="text-red-600 hover:text-red-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                     <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                     </svg>
                </button>

            </div>
        `;

    });

}

renderExpenses();

function deleteExpense(index){

    expenses.splice(index,1);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    renderExpenses();
    calculateTotal();
}



let chart;

function updateChart(){

    const salary =
        Number(localStorage.getItem("salary")) || 0;

    const totalExpense =
        expenses.reduce((sum,item)=>sum+item.amount,0);

    const remaining =
        salary-totalExpense;

    const ctx =
        document.getElementById("expenseChart");

    if(chart){

        chart.destroy();

    }

    chart = new Chart(ctx,{

        type:"pie",

        data:{

            labels:[
                "Remaining Balance",
                "Expenses"
            ],

            datasets:[{

                data:[
                    remaining,
                    totalExpense
                ]

            }]

        }

    });

}

updateChart();