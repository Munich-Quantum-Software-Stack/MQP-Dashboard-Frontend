import { useSelector } from 'react-redux';
import PaneCard from '@components/UI/Card/PaneCard';
import PDFLink from '@components/UI/Document/PDFLink';
import UpdatedDate from '@components/UI/UpdatedDate';

const FriendlyUserPilotStructure = () => {
  const fs = useSelector((state) => state.accessibilities.font_size);
  const status_item_name_fs = +fs * 1.5;
  const status_item_text_fs = +fs;
  return (
    <PaneCard className={`status_item status_item_bg`}>
      <div className="d-flex justify-content-between">
        <div className="status_item_title">
          <h5 className="pane_title status_title" style={{ fontSize: status_item_name_fs }}>
            Structure and tools of the Friendly User Pilot Phase
          </h5>
          <div className="short_divider"></div>
        </div>
      </div>

      <div className="pane_desc">
        <div className="my-2" style={{ fontSize: status_item_text_fs }}>
          <PDFLink
            src="/documents/Friendly-User-Pilot-Phase_Structure_Tools.pdf"
            target="_blank"
            pdf_link_class="left_icon_link"
            pdf_text="Friendly-User-Pilot-Phase_Structure_Tools.pdf"
          />
        </div>
      </div>
      <div className="pane_date">
        <UpdatedDate />
      </div>
    </PaneCard>
  );
};

export default FriendlyUserPilotStructure;
