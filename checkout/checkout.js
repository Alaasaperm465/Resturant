
document.getElementById("confirmOrder").addEventListener("click", () => {

    alert(" You must be logged in to confirm the order.");
    window.location.href = "../home/home.html";
    return;

    // alert(`Order confirmed for ${loggedInUser.name}!`);
    // let orders = JSON.parse(localStorage.getItem("orders")) || [];
    // orders.push({ user: loggedInUser.email, mealId });
    // localStorage.setItem("orders", JSON.stringify(orders));

    // window.location.href = "";
  });

