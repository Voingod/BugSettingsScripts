function CheckContactAndUserSender() {
    var contactFetch = '<fetch aggregate="true" >' +
        '<entity name="uds_errorrequestbuttonsettings" >' +
        '<link-entity name="uds_uds_errorrequestbuttonsettings_contact" from="uds_errorrequestbuttonsettingsid" to="uds_errorrequestbuttonsettingsid" intersect="true" >' +
        '<link-entity name="contact" from="contactid" to="contactid" intersect="true" >' +
        '<attribute name="fullname" alias="fullname" aggregate="count" />' +
        '</link-entity>' +
        '</link-entity>' +
        '</entity>' +
        '</fetch>';

    var userFetch = '<fetch aggregate="true">' +
        '<entity name="uds_errorrequestbuttonsettings">' +
        '<link-entity name="uds_uds_errorrequestbuttonsettings_systemus" from="uds_errorrequestbuttonsettingsid" to="uds_errorrequestbuttonsettingsid" intersect="true">' +
        '<link-entity name="systemuser" from="systemuserid" to="systemuserid" intersect="true">' +
        '<attribute name="fullname" alias="fullname" aggregate="count" />' +
        '</link-entity>' +
        '</link-entity>' +
        '</entity>' +
        '</fetch>';
    debugger;
    var countContact = XrmServiceToolkit.Soap.Fetch(contactFetch);
    var countUser = XrmServiceToolkit.Soap.Fetch(userFetch);

    if ((countContact != null && countContact.length > 0)
        || (countUser != null && countUser.length > 0)) {

        if (countContact[0].attributes.fullname.value > 0 ||
            countUser[0].attributes.fullname.value > 0) {

            Xrm.Page.ui.clearFormNotification('005');

        } else {
            Xrm.Page.ui.setFormNotification("Unable to send the request to support team. Notification recipients are not specified in Bug Handler Settings. Please contact your administrator.", 'WARNING', '005');

        }
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

        var look = window.parent.Xrm.Page.getAttribute("uds_emailtocontactid").getValue();
        if (look != null && look.length > 0) {
            var cols = ["donotemail"];
            var retrievedContact = window.parent.XrmServiceToolkit.Soap.Retrieve(look[0].entityType, look[0].id, cols);
            if (retrievedContact.attributes.donotemail.value == true) {
                window.parent.Xrm.Page.ui.setFormNotification("Email notifications are not allowed for the contact. Please check it.", 'WARNING', '003');
                return;
            }
        }
        debugger;
        window.parent.Xrm.Page.getAttribute("uds_confirm").setValue(1);
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
        '<attribute name="siteid" />' +
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
        "<cell name='siteid' width='150' />" +
        "</row>" +
        "</grid>";
    Xrm.Page.getControl("uds_emailtouserid").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
}