const emailDebugger = require("debug")("app:email");

// Make a sendInvoiceEmail module in utils
const sendInvoiceGeneric = require("./sendEmailGeneric");

const weekdays = [
  { day: "Mon", dayName: "Monday" },
  { day: "Tue", dayName: "Tuesday" },
  { day: "Wed", dayName: "Wednesday" },
  { day: "Thu", dayName: "Thursday" },
  { day: "Fri", dayName: "Friday" },
  { day: "Sat", dayName: "Saturday" },
  { day: "Sun", dayName: "Sunday" }
];

sendInvoiceEmail = async input => {
  // console.log("%%%%%%%%%%%%%%%%%%% Invoice Email %%%%%%%%%%%%%%%%%%%%%%%%%%");
  console.log("sendInvoiceEmail payschedule:", input);
  // console.log("################### Email Body Pieces ######################");
  let dayName;
  if (input.paySchedule.value === "installment") {
    console.log("!!!!!!!!!!!!!!!!!! we are in installment");
    let insType = input.paySchedulePolicy.installmentType;
    console.log("insType:", insType);
    if (insType === "weekly" || insType === "bi-weekly") {
      console.log(
        "inside weekly: input.paySchedulePolicy.payByDayOfWeek :",
        input.paySchedulePolicy.payByDayOfWeek
      );
      weekdays.forEach(obj => {
        if (obj.day === input.paySchedulePolicy.payByDayOfWeek) {
          dayName = obj.dayName;
        }
      });
    }
  }

  let invReq = input.items;

  let itemPortion = "<ol>";
  let totCost = 0;
  invReq.forEach(obj => {
    totCost = totCost + obj.cost;
    // emailDebugger('totCost:', totCost, ' obj.cost:', obj.cost );
    let ill = 45; // Item line length
    let itemName;
    if (obj.itemName.length > 40) {
      itemName = obj.itemName.substring(0, 44);
    } else {
      itemName = obj.itemName;
    }
    let dottedLineLength = ill - itemName.length;

    let dotLine = "";
    for (var i = 0; i < dottedLineLength; i++) {
      dotLine = dotLine + ".";
    }
    itemPortion =
      itemPortion +
      "<li>" +
      obj.itemName +
      "&nbsp;" +
      dotLine +
      "(" +
      obj.quantity +
      "&nbsp;@&nbsp;" +
      obj.price +
      "$ for " +
      obj.unitName +
      "&nbsp;)" +
      "&nbsp;&nbsp;&nbsp;$ <b>" +
      obj.cost.toFixed(2) +
      "</b></li>";
  });
  itemPortion = itemPortion + "</ol>";

  //   emailDebugger('itemPortion: ', itemPortion);
  //   return '';

  let invoiceHeader = "";
  invoiceHeader =
    invoiceHeader +
    "<font color='blue' size='4'><b>" +
    input.orgName +
    "</b></font><br/>";
  invoiceHeader =
    invoiceHeader +
    "<font color='blue' size='3'><b>" +
    input.orgType1 +
    "</b></font><br/>";
  invoiceHeader =
    invoiceHeader +
    "<font color='blue' size='3'><b>" +
    input.orgType2 +
    "</b></font><br/><br/>";
  invoiceHeader =
    invoiceHeader +
    "<font color='#7826bf' size='3'>Invoice #:&nbsp;<b>" +
    input.invoiceId +
    "</b></font><br/>";
  invoiceHeader =
    invoiceHeader +
    "<font color='#7826bf' size='3'>Name:&nbsp;<b>" +
    input.customerName +
    "</b></font><br/><br/>" +
    "<font color='black' size='3'><b>Itemized breakdown:</b>";

  let payPolicyL1 = "";
  let payPolicyL2 = "";
  let payPolicyL3 = "";
  let payPolicyL4 = "";
  if (input.paySchedule.value === "fullpay") {
    payPolicyL1 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Payment Status: Paid in full<br/>";
  } else if (input.paySchedule.value === "partpay") {
    payPolicyL1 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;payment Status: Paid in part<br/.>";
    payPolicyL2 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next Payment due on:&nbsp;" +
      input.paySchedulePolicy.nextSchedulePayDay;
    +"<br/>";
  } else {
    payPolicyL1 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Payment Process: To be paid in installment<br/>";
    payPolicyL2 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Next Payment due on:&nbsp;" +
      input.paySchedulePolicy.nextSchedulePayDay +
      "<br/>";
    payPolicyL3 =
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Installment type:&nbsp;" +
      input.paySchedulePolicy.installmentType +
      "<br/>";
    if (
      input.paySchedulePolicy.installmentType === "monthly" ||
      input.paySchedulePolicy.installmentType === "bi-monthly"
    ) {
      payPolicyL4 =
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be paid by&nbsp;" +
        input.paySchedulePolicy.payByDateOfMonth +
        "&nbsp; day of the month." +
        "<br/>>";
    } else {
      // payPolicyL4 =
      //   "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be paid by&nbsp;" +
      //   input.paySchedulePolicy.payByDayOfWeek +
      //   "&nbsp; day of the week." +
      //   "<br/>>";
      if (input.paySchedulePolicy.installmentType === "weekly") {
        payPolicyL4 =
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be paid by&nbsp;" +
          dayName +
          "&nbsp; of every week." +
          "<br/>>";
      } else {
        payPolicyL4 =
          "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be paid by&nbsp;" +
          dayName +
          "&nbsp; of every two weeks." +
          "<br/>>";
      }
    }
  }

  let totalSection = "";
  let lineBuffer =
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  totalSection =
    lineBuffer +
    "Total Itemized Cost:&nbsp;$&nbsp;<b>" +
    totCost.toFixed(2) +
    "</b><br/>";
  if (input.finBreakdown.discountAmount > 0) {
    totalSection =
      totalSection +
      lineBuffer +
      "Discount Amount:&nbsp;$&nbsp;<b>" +
      input.finBreakdown.discountAmount.toFixed(2) +
      "</b><br/>";
  }
  if (input.finBreakdown.taxAmount > 0) {
    totalSection =
      totalSection +
      lineBuffer +
      "Tax Amount:&nbsp;$&nbsp;<b>" +
      input.finBreakdown.taxAmount.toFixed(2) +
      "</b><br/>";
  }
  totalSection =
    totalSection +
    lineBuffer +
    "Total Invoice Amount:&nbsp;$&nbsp;<b>" +
    input.finBreakdown.totalInvoiceAmount.toFixed(2) +
    "</b></br>";
  totalSection =
    totalSection +
    lineBuffer +
    "Total Amount Paid:&nbsp;$&nbsp;<b>" +
    input.finBreakdown.amountPaid.toFixed(2) +
    "</b><br/><br/>";

  let note = "";
  //   emailDebugger('note:', input.invoiceNote );

  note =
    "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Note</b>:&nbsp;" +
    input.invoiceNote +
    "<br/><br/>";

  let signature =
    "&nbsp;&nbsp;&nbsp;<font color='black'><i>Thank your for your business ... </i><br/><br/>" +
    "&nbsp;&nbsp;&nbsp;<font color='blue'><b>" +
    input.senderName +
    "</b><br/>" +
    "&nbsp;&nbsp;&nbsp;<font color='blue'><b>" +
    input.senderEmail +
    "</b><br/>";

  let invHtml;
  invHtml =
    "<pre>" +
    invoiceHeader +
    itemPortion +
    totalSection +
    payPolicyL1 +
    payPolicyL2 +
    payPolicyL3 +
    payPolicyL4 +
    note +
    signature;
  ("</pre>");

  //   emailDebugger("itemPortion:", invHtml);

  // If there are picture attachments embedded in body or put signature logo etc.
  // use the format such as
  // htmlbody = htmlbody + ","
  // attachments: [
  //   {
  //     filename: emailReq.embedpic1,
  //     path: emailReq.embedpictures3url1,
  //     cid: "embedpic1"
  //   },
  //   {
  //     filename: emailReq.logo,
  //     path: emailReq.logos3url,
  //     cid: "logo"
  //   }
  // ]
  // To be remembered, htmlbody should include the proper references. Check sendMail.js for
  //  reference.

  emailData = {
    subject: "Invoice & Receipt from " + input.orgName,
    toEmail: input.toEmail,
    body: invHtml
  };
  console.log("Before  calling  sendInvoiceGeneric");

  let retEmail = await sendInvoiceGeneric(emailData);

  console.log("sendInvoiceEmail retEmail:", retEmail);

  return retEmail;
};

module.exports = sendInvoiceEmail;
