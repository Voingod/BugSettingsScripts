function CheckContactAndUserSender() {
    var contact = "uds_errorrequestbuttonsettingses?$expand=uds_uds_errorrequestbuttonsettings_contact" +
        "($select=fullname)&$filter=(uds_uds_errorrequestbuttonsettings_contact/any(o1:(o1/contactid ne null)))&$top=1"

    var user = "uds_errorrequestbuttonsettingses?$expand=uds_uds_errorrequestbuttonsettings_systemuser" +
        "($select=fullname)&$filter=(uds_uds_errorrequestbuttonsettings_systemuser/any(o1:(o1/systemuserid ne null)))&$top=1";

    var apiQueryContacts = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.1/" + contact;
    var apiQueryUsers = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.1/" + user;

    var countContact = ExecuteQuery(apiQueryContacts);
    var countUser = ExecuteQuery(apiQueryUsers);

    if ((countContact === null || countContact === undefined)
        && (countUser === null || countUser === undefined)) {
        window.parent.Xrm.Page.ui.setFormNotification("Unable to send the request to support team. Notification recipients are not specified in Bug Handler Settings. Please contact your administrator.", 'WARNING', '005');
        
    }
    // else if (countContact.length === 0 && countUser.length === 0) {
    //     Xrm.Page.ui.setFormNotification("Unable to send the request to support team. Either sending user or notification recipients are not specified in Bug Handler Settings. Please contact your administrator.", 'WARNING', '001');
    // }
    else {
        window.parent.Xrm.Page.ui.clearFormNotification('005');
        
    }
}

function SendMessage() {
    var confirm = window.parent.Xrm.Page.getAttribute("uds_confirm").getValue();
    if (confirm == 1) {
        window.parent.Xrm.Page.ui.clearFormNotification('002');
        window.parent.Xrm.Page.ui.clearFormNotification('003');
        return;
    }
    var userid = window.parent.Xrm.Page.getAttribute("uds_emailtouserid").getValue();
    var contactid = window.parent.Xrm.Page.getAttribute("uds_emailtocontactid").getValue();
    if (userid == null && contactid == null) {
        window.parent.Xrm.Page.ui.setFormNotification("Choose user or contact to send email", 'WARNING', '001');
    }
    else {
        debugger;
        var contact = window.parent.Xrm.Page.getAttribute("uds_emailtocontactid").getValue();

        if (contact != null && contact.length > 0) {
            var apiQuery = Xrm.Page.context.getClientUrl() + "/api/data/v8.1/" + "contacts?$select=donotemail,emailaddress1&$filter=contactid eq  '" + contact[0].id + "'";
            var entityList = ExecuteQuery(apiQuery);
            if (entityList[0].donotemail == true) {
                window.parent.Xrm.Page.ui.setFormNotification("Email notifications are not allowed for the contact. Please check it.", 'WARNING', '003');
                return;
            }
        }
        debugger;
        window.parent.Xrm.Page.getAttribute("uds_confirm").setValue(true);
        window.parent.Xrm.Page.ui.clearFormNotification('001');
            window.parent.Xrm.Page.ui.setFormNotification("Email was sent", 'WARNING', '002');
        window.parent.Xrm.Page.data.entity.save();
    }
}


function NewMessage() {
    window.parent.Xrm.Page.ui.clearFormNotification('003');
    window.parent.Xrm.Page.ui.clearFormNotification('002');
    window.parent.Xrm.Page.ui.clearFormNotification('001');
    window.parent.Xrm.Page.getAttribute("uds_emailtouserid").setValue(null);
    window.parent.Xrm.Page.getAttribute("uds_emailtocontactid").setValue(null);
    window.parent.Xrm.Page.getAttribute("uds_messageforuser").setValue(null);
    window.parent.Xrm.Page.getAttribute("uds_confirm").setValue(0);
    window.parent.Xrm.Page.data.entity.save();
}

function SetFilterContactLookup() {
    var viewId = "{8FBE1AFC-FE20-47E9-91D4-18F306B32676}";
    var viewDisplayName = "Active contacts with email";
    var entityName = "contact";

    var fetchXml = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
        '<entity name="contact">' +
        '<attribute name="fullname" />' +
        '<attribute name="telephone1" />' +
        '<attribute name="contactid" />' +
        '<attribute name="emailaddress1" />' +
        '<attribute name="parentcustomerid" />' +
        '<attribute name="address1_telephone1" />' +
        '<attribute name="address1_city" />' +
        '<order attribute="fullname" descending="false" />' +
        '<filter type="and">' +
        '<condition attribute="statecode" operator="eq" value="0" />' +
        '<condition attribute="emailaddress1" operator="not-null" />' +
        '</filter>' +
        '</entity>' +
        '</fetch>';
    var layoutXml = "<grid name='resultset' object='2' jump='contactid' select='1'  icon='1' preview='1'>" +
        "<row name='result' id='contactid'>" +
        "<cell name='fullname' width='200' />" +
        "<cell name='telephone1' width='150' />" +
        "<cell name='emailaddress1' width='150' />" +
        "<cell name='parentcustomerid' width='150' />" +
        "<cell name='address1_telephone1' width='150' />" +
        "<cell name='address1_city' width='150' />" +
        "</row>" +
        "</grid>";
    Xrm.Page.getControl("uds_emailtocontactid").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
}

function SetFilterUserLookup() {
    var viewId = "{8FBE1AFC-FE20-47E9-91D4-11F306B32676}";
    var viewDisplayName = "Active users with email";
    var entityName = "systemuser";

    var fetchXml = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
        '<entity name="systemuser">' +
        '<attribute name="fullname" />' +
        '<attribute name="businessunitid" />' +
        '<attribute name="title" />' +
        '<attribute name="address1_telephone1" />' +
        '<attribute name="positionid" />' +
        '<attribute name="systemuserid" />' +
        '<attribute name="internalemailaddress" />' +
        // '<attribute name="siteid" />' +
        '<order attribute="fullname" descending="false" />' +
        '<filter type="and">' +
        '<condition attribute="accessmode" operator="ne" value="3" />' +
        '<condition attribute="accessmode" operator="ne" value="5" />' +
        '<condition attribute="isdisabled" operator="eq" value="0" />' +
        '<condition attribute="internalemailaddress" operator="not-null" />' +
        '</filter>' +
        '</entity>' +
        '</fetch>';
    var layoutXml = "<grid name='resultset' object='2' jump='systemuserid' select='1'  icon='1' preview='1'>" +
        "<row name='result' id='systemuserid'>" +
        "<cell name='fullname' width='200' />" +
        "<cell name='businessunitid' width='150' />" +
        "<cell name='title' width='150' />" +
        "<cell name='address1_telephone1' width='150' />" +
        "<cell name='positionid' width='150' />" +
        "<cell name='internalemailaddress' width='150' />" +
        // "<cell name='siteid' width='150' />" +
        "</row>" +
        "</grid>";
    Xrm.Page.getControl("uds_emailtouserid").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
}

function ExecuteQuery(apiQuery) {
    var results;
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: apiQuery,
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
        },
        success: function (data, textStatus, xhr) {
            if (data.value != null && data.value.length) {
                results = data.value;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            if (xhr && xhr.responseText) {
                console.error('OData Query Failed: \r\n' + apiQuery + '\r\n' + xhr.responseText);
            }
            throw new Error(errorThrown);
        }
    });
    return results;
}