import { useSelector } from 'react-redux';
import PaneCard from '@components/UI/Card/PaneCard';
import PDFLink from '@components/UI/Document/PDFLink';
// Use inline updated date markup (no UpdatedDate component present)

const QAOA_MaxCut = () => {
  const fs = useSelector((state) => state.accessibilities.font_size);
  const status_item_name_fs = +fs * 1.5;
  const status_item_text_fs = +fs;
  return (
    <PaneCard className={`status_item status_item_bg`}>
      <div className="d-flex justify-content-between">
        <div className="status_item_title">
          <h5 className="pane_title status_title" style={{ fontSize: status_item_name_fs }}>
            Algorithmic demo: QAOA
          </h5>
          <div className="short_divider"></div>
        </div>
      </div>

      <div className="pane_desc">
        <div className="my-2" style={{ fontSize: status_item_text_fs }}>
          <PDFLink
            src="/documents/MaxCut_LRZ_FUPP.pdf"
            target="_blank"
            pdf_link_class="left_icon_link"
            pdf_text="MaxCut_LRZ_FUPP.pdf"
          />
        </div>
      </div>
      <div className="pane_date">
        <div className="updated_date">Updated: Sept 19, 2024</div>
      </div>
    </PaneCard>
  );
};

export default QAOA_MaxCut;
