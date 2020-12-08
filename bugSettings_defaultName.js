function setDefaultName() {
    var formType = Xrm.Page.ui.getFormType();
    if (formType === 1) {
        var fieldName = "uds_name";
        Xrm.Page.getAttribute(fieldName).setSubmitMode("always");
        Xrm.Page.getAttribute(fieldName).setValue("Settings record (only one can be created)");
    }
}