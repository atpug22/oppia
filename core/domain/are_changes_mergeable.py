def are_changes_mergeable(exp_id, version, change_list):
    """
    version: version of an exploration from frontend on which a user is working.
    latest_version: latest version of an exploration in the backend.
    complete_change_list: complete list of the changes in an exploration from the
                            backend between version and latest version.
    added_states_name: list of new states added in a complete change list.
    deleted_states_name: list of deleted states in a complete change list.
    old_to_new_state_names: stores the changes in the state names in the complete_change_list.
    old_version: copy of the frontend version of an exploration.
    new_version: copy of the latest backend version of an exploration.
    changed_properties: list of all the properties changed according to the state and property name.

    """

    latest_version = exp_fetchers.get_exploration_by_id(exp_id).version
    if latest_version == version:
        return True
    else:
        complete_change_list = getCompleteChangeList(exp_id, version, latest_version)
        exp_versions_diff = exp_domain.ExplorationVersionsDiff(complete_change_list)
        added_state_names = exp_versions_diff.added_state_names
        deleted_state_names = exp_versions_diff.deleted_state_names
        new_to_old_state_names = exp_versions_diff.old_to_new_state_names
        old_to_new_state_names = exp_versions_diff.new_to_old_state_names

        old_version = exp_fetchers.get_exploration_by_id(exp_id, version)
        new_version = exp_fetchers.get_exploration_by_id(exp_id, latest_version)
        if added_state_names.length > 0 or deleted_state_names.length > 0:
            """
            Here we will send the changelist, version, latest_version,
            and exploration to the admin, so that the conditions can we reviewed

            """
            return False

        changed_properties = {}
        for change in complete_change_list:
            if change.cmd == exp_domain.CMD_EDIT_STATE_PROPERTY:
                changed_properties[change.state_name][change.property].append(change)

        """ changed_properties = {
            "statename" : {
                "property1": [changes],
                "property2": [changes],
            }
        } """

        new_state_renamed = {}
        for change in change_list:
            is_change_mergeable = False
            if change.cmd == exp_domain.CMD_RENAME_STATE:
                new_state_renamed[change.old_value] = change.new_value
            elif change.cmd == exp_domain.CMD_EDIT_STATE_PROPERTY:
                old_state_name = change.state_name
                new_state_name = old_to_new_state_name[old_state_name]
                if change.property_name == exp_domain.STATE_PROPERTY_CONTENT:
                    if old_version[old_state_name].content == new_version[new_state_name].content:
                        is_change_mergeable = True
                elif (change.property_name ==
                      exp_domain.STATE_PROPERTY_INTERACTION_ID):
                    if old_version[old_state_name].interaction_id == old_version[new_state_name].interaction_id:
                        is_change_mergeable = True
                """
                Rest of the comparisons according will come here.
                .
                .
                .
                .
                . """
            if is_change_mergeable:
                continue
            else:
                return False